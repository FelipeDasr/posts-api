const User = require('../user');
const Post = require('../post');

// User to many Posts
User.hasMany(Post);
Post.belongsTo(User);