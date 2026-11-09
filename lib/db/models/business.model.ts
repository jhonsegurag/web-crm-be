import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface BusinessAttributes {
  id: string; name: string; slug: string; logoUrl?: string;
  timezone: string; currency: string; plan: string; settings?: object;
}
interface BusinessCreationAttributes extends Optional<BusinessAttributes, 'id' | 'logoUrl' | 'settings' | 'timezone' | 'currency' | 'plan'> {}

export class Business extends Model<BusinessAttributes, BusinessCreationAttributes> {
  declare id: string; declare name: string; declare slug: string;
  declare logoUrl?: string; declare timezone: string; declare currency: string;
  declare plan: string; declare settings?: object;
}

Business.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  logoUrl: { type: DataTypes.STRING },
  timezone: { type: DataTypes.STRING, defaultValue: 'UTC' },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  plan: { type: DataTypes.ENUM('free', 'starter', 'pro', 'enterprise'), defaultValue: 'free' },
  settings: { type: DataTypes.JSON },
}, { sequelize, modelName: 'Business', tableName: 'businesses' });
