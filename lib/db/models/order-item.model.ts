import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface OrderItemAttributes {
  id: string; orderId: string; productId: string; name: string;
  price: number; quantity: number; subtotal: number; notes?: string;
}
interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id' | 'notes' | 'quantity'> {}

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> {
  declare id: string; declare orderId: string; declare productId: string;
  declare name: string; declare price: number; declare quantity: number;
  declare subtotal: number; declare notes?: string;
}

OrderItem.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  notes: { type: DataTypes.TEXT },
}, { sequelize, modelName: 'OrderItem', tableName: 'order_items' });
