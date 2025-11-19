// Importa la instància de sequelize i els models de la base de dades.
import sequelize from "../database/sequelize.js";
import User from "./user.model.js";
import Session from "./session.model.js";
import Post from "./post.model.js";
import Comment from "./comment.model.js";
import Participation from "./participation.model.js";

// Defineix les associacions entre els models.
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId" });

User.belongsToMany(Session, { through: Participation, foreignKey: "userId" });
Session.belongsToMany(User, { through: Participation, foreignKey: "sessionId" });

// Agrupa la instància de sequelize i tots els models en un objecte 'db'.
const db = {
  sequelize,
  User,
  Session,
  Post,
  Comment,
  Participation,
};


export default db;
