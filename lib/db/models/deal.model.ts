import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface DealAttributes {
  id: string; businessId: string; stageId: string; contactId?: string;
  title: string; value: number; currency: string; probability: number;
  expectedCloseDate?: Date; assignedTo?: string; notes?: string; tags?: string[]; position: number; orderId?: string;
}
interface DealCreationAttributes extends Optional<DealAttributes, 'id' | 'contactId' | 'expectedCloseDate' | 'assignedTo' | 'notes' | 'tags' | 'value' | 'currency' | 'probability' | 'position' | 'orderId'> {}

export class Deal extends Model<DealAttributes, DealCreationAttributes> {
  declare id: string; declare businessId: string; declare stageId: string;
  declare contactId?: string; declare title: string; declare value: number;
  declare currency: string; declare probability: number; declare position: number;
  declare orderId?: string;
}

Deal.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  stageId: { type: DataTypes.UUID, allowNull: false },
  contactId: { type: DataTypes.UUID },
  title: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  probability: { type: DataTypes.INTEGER, defaultValue: 50 },
  expectedCloseDate: { type: DataTypes.DATEONLY },
  assignedTo: { type: DataTypes.UUID },
  notes: { type: DataTypes.TEXT },
  tags: { type: DataTypes.JSON, defaultValue: [] },
  position: { type: DataTypes.INTEGER, defaultValue: 0 },
  orderId: { type: DataTypes.UUID },
}, { sequelize, modelName: 'Deal', tableName: 'deals' });
