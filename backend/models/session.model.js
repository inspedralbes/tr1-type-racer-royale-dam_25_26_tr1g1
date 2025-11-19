import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Model 'Session' per a sessions d'entrenament.
const Session = sequelize.define('Session', {
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
    allowNull: true,
  },
  max_usuarios: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'Sessions'
});

export default Session;
