import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface OrderAttributes {
  id: string; businessId: string; contactId?: string; tableId?: string; locationId?: string;
  code: string; status: string; channel: string; notes?: string;
  subtotal: number; discount: number; tax: number; total: number; assignedTo?: string;
}
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'contactId' | 'tableId' | 'locationId' | 'notes' | 'assignedTo' | 'status' | 'channel' | 'subtotal' | 'discount' | 'tax' | 'total'> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  declare id: string; declare businessId: string; declare contactId?: string;
  declare tableId?: string; declare locationId?: string; declare code: string;
  declare status: string; declare channel: string; declare notes?: string;
  declare subtotal: number; declare discount: number; declare tax: number;
  declare total: number; declare assignedTo?: string;
}

Order.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  contactId: { type: DataTypes.UUID },
  tableId: { type: DataTypes.UUID },
  locationId: { type: DataTypes.UUID },
  code: { type: DataTypes.STRING, unique: true },
  status: { type: DataTypes.ENUM('draft', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'refunded'), defaultValue: 'draft' },
  channel: { type: DataTypes.ENUM('in_store', 'online', 'phone', 'app'), defaultValue: 'in_store' },
  notes: { type: DataTypes.TEXT },
  subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  tax: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  assignedTo: { type: DataTypes.UUID },
}, { sequelize, modelName: 'Order', tableName: 'orders' });
