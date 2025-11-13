import { DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

const Session = sequelize.define("Session", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  tipo_ejercicio: {
    type: DataTypes.STRING,
  },
  duracion: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  max_usuarios: {
    type: DataTypes.INTEGER,
  },
});

export default Session;
