import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface AgentConfigAttributes {
  id: string; businessId: string; name: string; provider: string; model?: string;
  systemPrompt?: string; temperature: number; maxTokens: number;
  isActive: boolean; webhookUrl?: string; configJson?: object;
}
interface AgentConfigCreationAttributes extends Optional<AgentConfigAttributes, 'id' | 'model' | 'systemPrompt' | 'webhookUrl' | 'configJson' | 'name' | 'provider' | 'temperature' | 'maxTokens' | 'isActive'> {}

export class AgentConfig extends Model<AgentConfigAttributes, AgentConfigCreationAttributes> {
  declare id: string; declare businessId: string; declare name: string;
  declare provider: string; declare model?: string; declare temperature: number;
  declare maxTokens: number; declare isActive: boolean;
}

AgentConfig.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, defaultValue: 'Default Agent' },
  provider: { type: DataTypes.ENUM('openai', 'anthropic', 'groq', 'custom'), defaultValue: 'openai' },
  model: { type: DataTypes.STRING },
  systemPrompt: { type: DataTypes.TEXT },
  temperature: { type: DataTypes.FLOAT, defaultValue: 0.7 },
  maxTokens: { type: DataTypes.INTEGER, defaultValue: 1024 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  webhookUrl: { type: DataTypes.STRING },
  configJson: { type: DataTypes.JSON },
}, { sequelize, modelName: 'AgentConfig', tableName: 'agent_configs' });
