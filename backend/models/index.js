import sequelize from "../database/sequelize.js";
import User from "./user.model.js";
import Session from "./session.model.js";
import Post from "./post.model.js";
import Comment from "./comment.model.js";
import Participation from "./participation.model.js";

// Associations
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

User.belongsToMany(Session, { through: Participation, foreignKey: "userId" });
Session.belongsToMany(User, { through: Participation, foreignKey: "sessionId" });

const db = {
  sequelize,
  User,
  Session,
  Post,
  Comment,
  Participation,
};

export default db;
