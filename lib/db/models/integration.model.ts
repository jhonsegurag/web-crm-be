import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface IntegrationAttributes {
  id: string; businessId: string; type: string; name: string;
  isActive: boolean; credentials?: object; settings?: object; lastSyncAt?: Date;
}
interface IntegrationCreationAttributes extends Optional<IntegrationAttributes, 'id' | 'credentials' | 'settings' | 'lastSyncAt' | 'isActive'> {}

export class Integration extends Model<IntegrationAttributes, IntegrationCreationAttributes> {
  declare id: string; declare businessId: string; declare type: string;
  declare name: string; declare isActive: boolean;
}

Integration.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM('stripe', 'mailchimp', 'slack', 'zapier', 'twilio', 'custom'), allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
  credentials: { type: DataTypes.JSON },
  settings: { type: DataTypes.JSON },
  lastSyncAt: { type: DataTypes.DATE },
}, { sequelize, modelName: 'Integration', tableName: 'integrations' });
