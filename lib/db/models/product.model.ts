import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface ProductAttributes {
  id: string; businessId: string; categoryId?: string; name: string; description?: string;
  sku?: string; price: number; cost?: number; type: string; unit: string;
  stock?: number; isActive: boolean; images?: string[];
}
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'categoryId' | 'description' | 'sku' | 'cost' | 'stock' | 'images' | 'type' | 'unit' | 'isActive'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  declare id: string; declare businessId: string; declare categoryId?: string;
  declare name: string; declare price: number; declare type: string;
  declare unit: string; declare isActive: boolean;
}

Product.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  categoryId: { type: DataTypes.UUID },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  sku: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  cost: { type: DataTypes.DECIMAL(10, 2) },
  type: { type: DataTypes.ENUM('product', 'service'), defaultValue: 'product' },
  unit: { type: DataTypes.STRING, defaultValue: 'unit' },
  stock: { type: DataTypes.INTEGER },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  images: { type: DataTypes.JSON, defaultValue: [] },
}, { sequelize, modelName: 'Product', tableName: 'products' });
