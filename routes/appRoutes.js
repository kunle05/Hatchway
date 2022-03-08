const Blogs = require("../controller/blogs");

module.exports = app => {
    app.get("/api/ping", Blogs.ping);
    app.get("/api/posts/", Blogs.posts);
}