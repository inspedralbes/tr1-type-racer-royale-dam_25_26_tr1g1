import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Like = sequelize.define(
  "Like",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    tableName: "Likes",
    timestamps: true,
  }
);

export default Like;
