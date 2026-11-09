import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface RoomAttributes { id: string; floorId: string; name: string; x: number; y: number; width: number; height: number; color: string; }
interface RoomCreationAttributes extends Optional<RoomAttributes, 'id' | 'color'> {}

export class Room extends Model<RoomAttributes, RoomCreationAttributes> {
  declare id: string; declare floorId: string; declare name: string;
  declare x: number; declare y: number; declare width: number; declare height: number; declare color: string;
}

Room.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  floorId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  x: { type: DataTypes.FLOAT, allowNull: false },
  y: { type: DataTypes.FLOAT, allowNull: false },
  width: { type: DataTypes.FLOAT, allowNull: false },
  height: { type: DataTypes.FLOAT, allowNull: false },
  color: { type: DataTypes.STRING, defaultValue: '#e2e8f0' },
}, { sequelize, modelName: 'Room', tableName: 'rooms' });
