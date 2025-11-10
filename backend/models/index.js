import User from './user.model.js';
import Post from './post.model.js';
import Comment from './comment.model.js';

// User-Post association
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { as: 'author', foreignKey: 'userId' });

// User-Comment association
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'userId' });

// Post-Comment association
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

export { User, Post, Comment };
