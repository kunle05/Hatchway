const validParams = ({tags, sortBy, direction}) => {
    const sortParams = ["id", "reads", "likes", "popularity"];
    const dir = ["asc", "desc"];

    if(!tags) {
        return [false, "Tags"]
    }
    else if(sortBy && !sortParams.includes(sortBy)) {
        return [false, "SortBy"]
    }
    else if(direction && !dir.includes(direction)) {
        return [false, "Direction"]
    }
    else return [true];
};

const filterPosts = (data, sortBy, direction) => {
    const filteredPosts = [], postIds = {};

    data.forEach((res, idx) => {
        postIds[res.id] = idx;
    });

    const valueArr = Object.values(postIds);
    for(let i =0; i < valueArr.length; i++) {
        filteredPosts.push(data[valueArr[i]])
    }

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

    return filteredPosts;
}

module.exports = { validParams, filterPosts }