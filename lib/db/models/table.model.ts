import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface TableAttributes {
  id: string; floorId: string; roomId?: string; label: string; capacity: number;
  shape: string; x: number; y: number; width: number; height: number; status: string;
}
interface TableCreationAttributes extends Optional<TableAttributes, 'id' | 'roomId' | 'capacity' | 'shape' | 'width' | 'height' | 'status'> {}

export class Table extends Model<TableAttributes, TableCreationAttributes> {
  declare id: string; declare floorId: string; declare roomId?: string;
  declare label: string; declare capacity: number; declare shape: string;
  declare x: number; declare y: number; declare width: number; declare height: number; declare status: string;
}

Table.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  floorId: { type: DataTypes.UUID, allowNull: false },
  roomId: { type: DataTypes.UUID },
  label: { type: DataTypes.STRING, allowNull: false },
  capacity: { type: DataTypes.INTEGER, defaultValue: 4 },
  shape: { type: DataTypes.ENUM('rect', 'circle'), defaultValue: 'rect' },
  x: { type: DataTypes.FLOAT, allowNull: false },
  y: { type: DataTypes.FLOAT, allowNull: false },
  width: { type: DataTypes.FLOAT, defaultValue: 60 },
  height: { type: DataTypes.FLOAT, defaultValue: 60 },
  status: { type: DataTypes.ENUM('available', 'occupied', 'reserved', 'inactive'), defaultValue: 'available' },
}, { sequelize, modelName: 'Table', tableName: 'tables' });
