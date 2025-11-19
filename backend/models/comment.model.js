import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Model 'Comment' per a comentaris en publicacions.
const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Comments'
});

export default Comment;
