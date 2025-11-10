import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Posts",
    timestamps: true,
  }
);

export default Post;
