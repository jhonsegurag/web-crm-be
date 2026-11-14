import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface WaitlistAttributes {
  id: string;
  email: string;
  name?: string;
  company?: string;
  position: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface WaitlistCreationAttributes extends Optional<WaitlistAttributes, 'id' | 'name' | 'company' | 'status'> {}

export class Waitlist extends Model<WaitlistAttributes, WaitlistCreationAttributes> {
  declare id: string;
  declare email: string;
  declare name?: string;
  declare company?: string;
  declare position: number;
  declare status: 'pending' | 'approved' | 'rejected';
}

Waitlist.init({
  id:       { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email:    { type: DataTypes.STRING, allowNull: false, unique: true },
  name:     { type: DataTypes.STRING },
  company:  { type: DataTypes.STRING },
  position: { type: DataTypes.INTEGER, allowNull: false },
  status:   { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
}, { sequelize, modelName: 'Waitlist', tableName: 'waitlist' });
