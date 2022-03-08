var rp = require('request-promise');
const requestURL = "https://api.hatchways.io/assessment/blog/posts?tag=";

module.exports = {
    ping: (req, res) => {
        res.status(200).json({"success": true});
    },
    posts: async (req, res) => {
        const sortParams = ["id", "reads", "likes", "popularity"];
        const dir = ["asc", "desc"];
        let {tags, sortBy, direction} = req.query;

        // check if atleast one tag was specified
        if(!tags) {
            return res.status(400).json({"error": "Tags parameter is required"});
        }

        // check if sortBy param is valid
        if(sortBy && !sortParams.includes(sortBy)) {
            return res.status(400).json({"error": "sortBy parameter is invalid"});
        }

        // check if direction param is valid
        if(direction && !dir.includes(direction)) {
            return res.status(400).json({"error": "direction parameter is invalid"});
        }

        // make api calls with provided tags
        let tagsArr = tags.split(',');  

        const postsRequest = tagsArr.map(tag => rp(requestURL+tag));
        try {
            var responseData = await Promise.all(postsRequest);
        } catch(error) {
            return res.status(200).json({"error": "something went wrong"});
        }

        let filteredPosts = [], allPosts = [], postIds = {};
        responseData.map(response => {
            let posts = JSON.parse(response).posts;
            allPosts.push(...posts)
        });

        // create object with post id as key for uniqueness
        allPosts.forEach((res, idx) => {
            postIds[res.id] = idx;
        });

        // filter out duplicate post using the post id
        let valueArr = Object.values(postIds);
        for(let i =0; i < valueArr.length; i++) {
            filteredPosts.push(allPosts[valueArr[i]])
        }

        // sort posts if needed
        if(sortBy || direction) {
            if(!sortBy) sortBy = "id";            
            filteredPosts.sort((a, b) => {
                if(direction && direction == "desc") {
                    if(a[sortBy] === b[sortBy]) return 0;
                    return a[sortBy] < b[sortBy] ? 1 : -1;
                }
                return a[sortBy] - b[sortBy];
            })
        }

        res.status(200).json({"posts": filteredPosts});
    }
}