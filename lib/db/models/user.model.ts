import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface UserAttributes {
  id: string; email: string; passwordHash: string;
  roleId?: string; businessId?: string; isActive: boolean;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'roleId' | 'businessId' | 'isActive'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string; declare email: string; declare passwordHash: string;
  declare roleId?: string; declare businessId?: string; declare isActive: boolean;
}

User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  roleId: { type: DataTypes.UUID },
  businessId: { type: DataTypes.UUID },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'User', tableName: 'users' });
