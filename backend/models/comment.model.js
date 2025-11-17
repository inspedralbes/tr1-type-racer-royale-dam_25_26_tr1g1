import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Comments'
});

export default Comment;
