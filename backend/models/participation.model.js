import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

// Defineix el model 'Participation' amb els seus atributs i configuració de taula.
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
  tableName: 'Participas' // Nom de la taula a la base de dades.
});

export default Participation; // Exporta el model.
