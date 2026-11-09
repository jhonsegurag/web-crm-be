import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface LocationAttributes {
  id: string; businessId: string; name: string; address?: string;
  city?: string; country?: string; phone?: string; isPrimary: boolean;
}
interface LocationCreationAttributes extends Optional<LocationAttributes, 'id' | 'address' | 'city' | 'country' | 'phone' | 'isPrimary'> {}

export class Location extends Model<LocationAttributes, LocationCreationAttributes> {
  declare id: string; declare businessId: string; declare name: string;
  declare address?: string; declare city?: string; declare country?: string;
  declare phone?: string; declare isPrimary: boolean;
}

Location.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'Location', tableName: 'locations' });
