import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Comment = sequelize.define("Comentari", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Comment;
