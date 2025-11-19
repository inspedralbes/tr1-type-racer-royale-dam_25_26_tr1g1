import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Model 'Post' per a publicacions.
const Post = sequelize.define('Post', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorType: {
    type: DataTypes.STRING, // 'user' o 'system'
    allowNull: false,
  },
}, {
  tableName: 'Posts'
});

export default Post;
