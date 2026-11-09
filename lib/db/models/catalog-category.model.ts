import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface CatalogCategoryAttributes { id: string; businessId: string; name: string; description?: string; parentId?: string; }
interface CatalogCategoryCreationAttributes extends Optional<CatalogCategoryAttributes, 'id' | 'description' | 'parentId'> {}

export class CatalogCategory extends Model<CatalogCategoryAttributes, CatalogCategoryCreationAttributes> {
  declare id: string; declare businessId: string; declare name: string;
  declare description?: string; declare parentId?: string;
}

CatalogCategory.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  parentId: { type: DataTypes.UUID },
}, { sequelize, modelName: 'CatalogCategory', tableName: 'catalog_categories' });
