import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface FeatureFlagAttributes {
  id: string; businessId?: string; key: string; label?: string;
  description?: string; isEnabled: boolean; configJson?: object;
}
interface FeatureFlagCreationAttributes extends Optional<FeatureFlagAttributes, 'id' | 'businessId' | 'label' | 'description' | 'configJson' | 'isEnabled'> {}

export class FeatureFlag extends Model<FeatureFlagAttributes, FeatureFlagCreationAttributes> {
  declare id: string; declare businessId?: string; declare key: string;
  declare label?: string; declare isEnabled: boolean;
}

FeatureFlag.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID },
  key: { type: DataTypes.STRING, allowNull: false },
  label: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  isEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  configJson: { type: DataTypes.JSON },
}, { sequelize, modelName: 'FeatureFlag', tableName: 'feature_flags' });
