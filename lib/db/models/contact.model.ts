import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface ContactAttributes {
  id: string; businessId: string; type: string; firstName: string; lastName?: string;
  email?: string; phone?: string; company?: string; avatarUrl?: string;
  tags?: string[]; customFields?: object; assignedTo?: string;
}
interface ContactCreationAttributes extends Optional<ContactAttributes, 'id' | 'lastName' | 'email' | 'phone' | 'company' | 'avatarUrl' | 'tags' | 'customFields' | 'assignedTo' | 'type'> {}

export class Contact extends Model<ContactAttributes, ContactCreationAttributes> {
  declare id: string; declare businessId: string; declare type: string;
  declare firstName: string; declare lastName?: string; declare email?: string;
  declare phone?: string; declare company?: string; declare avatarUrl?: string;
  declare tags?: string[]; declare customFields?: object; declare assignedTo?: string;
}

Contact.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM('customer', 'lead', 'supplier'), defaultValue: 'customer' },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  avatarUrl: { type: DataTypes.STRING },
  tags: { type: DataTypes.JSON, defaultValue: [] },
  customFields: { type: DataTypes.JSON },
  assignedTo: { type: DataTypes.UUID },
}, { sequelize, modelName: 'Contact', tableName: 'contacts' });
