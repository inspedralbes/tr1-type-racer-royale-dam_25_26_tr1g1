import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Participation = sequelize.define('Participation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'Participas'
});

export default Participation;
