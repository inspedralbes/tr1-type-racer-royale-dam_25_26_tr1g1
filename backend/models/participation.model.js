import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Participation = sequelize.define("Participa", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Participation;
