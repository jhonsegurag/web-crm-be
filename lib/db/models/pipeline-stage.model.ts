import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface PipelineStageAttributes {
  id: string; businessId: string; name: string; color: string;
  position: number; isClosed: boolean; isWon: boolean;
}
interface PipelineStageCreationAttributes extends Optional<PipelineStageAttributes, 'id' | 'color' | 'position' | 'isClosed' | 'isWon'> {}

export class PipelineStage extends Model<PipelineStageAttributes, PipelineStageCreationAttributes> {
  declare id: string; declare businessId: string; declare name: string;
  declare color: string; declare position: number; declare isClosed: boolean; declare isWon: boolean;
}

PipelineStage.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, defaultValue: '#6366f1' },
  position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isClosed: { type: DataTypes.BOOLEAN, defaultValue: false },
  isWon: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'PipelineStage', tableName: 'pipeline_stages' });
