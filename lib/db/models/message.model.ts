import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface MessageAttributes {
  id: string; conversationId: string; senderType: string; senderId?: string;
  content: string; attachments?: string[]; isRead: boolean;
}
interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'senderId' | 'attachments' | 'isRead'> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> {
  declare id: string; declare conversationId: string; declare senderType: string;
  declare senderId?: string; declare content: string; declare attachments?: string[];
  declare isRead: boolean;
}

Message.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  conversationId: { type: DataTypes.UUID, allowNull: false },
  senderType: { type: DataTypes.ENUM('user', 'contact', 'agent'), allowNull: false },
  senderId: { type: DataTypes.UUID },
  content: { type: DataTypes.TEXT, allowNull: false },
  attachments: { type: DataTypes.JSON, defaultValue: [] },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'Message', tableName: 'messages' });
