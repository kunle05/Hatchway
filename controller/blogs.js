const redis = require("redis");
const rp = require('request-promise');
const { promisifyAll } = require('bluebird');
const { validParams, filterPosts } = require('./utils');
promisifyAll(redis);

const client = redis.createClient();
client.on('connect', () => console.log("Redis is connected"));
const requestURL = "https://api.hatchways.io/assessment/blog/posts?tag=";

module.exports = {
    ping: (req, res) => {
        res.status(200).json({"success": true});
    },
    posts: async (req, res) => {
        const {tags, sortBy, direction} = req.query;
        const [valid, value] = validParams(req.query);
        if(!valid) {
            return res.status(400).json({"error": `${value} parameter is required`});
        }

        const tagsArr = tags.split(',');  
        const postsRequest = [], allPosts = [], tagsToBeCached = [];

        for(let x = 0; x < tagsArr.length; x++) {
            let tag = tagsArr[x];
            const tagCachedData = await client.getAsync(tag);
            if(tagCachedData) {
                let posts = JSON.parse(tagCachedData).posts;
                allPosts.push(...posts);
            } else {
                tagsToBeCached.push(tag);
                postsRequest.push(rp(requestURL+tag));
            }
        }

        if(tagsToBeCached.length != 0) { 
            let responseData;
            try {
                responseData = await Promise.all(postsRequest);
            } catch(error) {
                return res.status(200).json({"error": "something went wrong"});
            }
            for(let i = 0; i < responseData.length; i++) { 
                await client.setAsync(tagsToBeCached[i], responseData[i]);
                let posts = JSON.parse(responseData[i]).posts;    
                allPosts.push(...posts);
            }
        };

        const filteredPosts = filterPosts(allPosts, sortBy, direction);
        res.status(200).json({"posts": filteredPosts});
    }
}