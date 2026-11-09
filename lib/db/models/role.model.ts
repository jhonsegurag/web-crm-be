import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface RoleAttributes { id: string; name: string; permissions: string[]; }
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'permissions'> {}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  declare id: string;
  declare name: string;
  declare permissions: string[];
}

Role.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  permissions: { type: DataTypes.JSON, defaultValue: [] },
}, { sequelize, modelName: 'Role', tableName: 'roles' });
