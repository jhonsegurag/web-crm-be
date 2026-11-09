import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface FloorAttributes {
  id: string; businessId: string; locationId?: string; name: string;
  level: number; widthPx: number; heightPx: number; backgroundUrl?: string;
}
interface FloorCreationAttributes extends Optional<FloorAttributes, 'id' | 'locationId' | 'backgroundUrl' | 'level' | 'widthPx' | 'heightPx'> {}

export class Floor extends Model<FloorAttributes, FloorCreationAttributes> {
  declare id: string; declare businessId: string; declare locationId?: string;
  declare name: string; declare level: number; declare widthPx: number;
  declare heightPx: number; declare backgroundUrl?: string;
}

Floor.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  locationId: { type: DataTypes.UUID },
  name: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.INTEGER, defaultValue: 0 },
  widthPx: { type: DataTypes.INTEGER, defaultValue: 1200 },
  heightPx: { type: DataTypes.INTEGER, defaultValue: 800 },
  backgroundUrl: { type: DataTypes.STRING },
}, { sequelize, modelName: 'Floor', tableName: 'floors' });
