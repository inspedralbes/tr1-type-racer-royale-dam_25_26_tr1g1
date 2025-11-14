import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Usuaris",
        key: "id",
      },
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Posts",
        key: "id",
      },
    },
  },
  {
    tableName: "Comentaris",
    timestamps: true,
  }
);

export default Comment;
