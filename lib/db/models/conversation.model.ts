import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface ConversationAttributes {
  id: string; businessId: string; contactId?: string; channel: string;
  subject?: string; status: string; assignedTo?: string; lastMessageAt?: Date;
}
interface ConversationCreationAttributes extends Optional<ConversationAttributes, 'id' | 'contactId' | 'subject' | 'assignedTo' | 'lastMessageAt' | 'status' | 'channel'> {}

export class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> {
  declare id: string; declare businessId: string; declare contactId?: string;
  declare channel: string; declare subject?: string; declare status: string;
  declare assignedTo?: string; declare lastMessageAt?: Date;
}

Conversation.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  contactId: { type: DataTypes.UUID },
  channel: { type: DataTypes.ENUM('chat', 'email', 'whatsapp', 'sms'), defaultValue: 'chat' },
  subject: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('open', 'pending', 'resolved', 'archived'), defaultValue: 'open' },
  assignedTo: { type: DataTypes.UUID },
  lastMessageAt: { type: DataTypes.DATE },
}, { sequelize, modelName: 'Conversation', tableName: 'conversations' });
