import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Post = sequelize.define('Post', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorType: {
    type: DataTypes.STRING, // 'user' or 'system'
    allowNull: false,
  },
}, {
  tableName: 'Posts'
});

export default Post;
