import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface AgentLogAttributes {
  id: string; agentConfigId: string; conversationId?: string; input: string;
  output?: string; tokensUsed?: number; latencyMs?: number; status: string; errorMessage?: string;
}
interface AgentLogCreationAttributes extends Optional<AgentLogAttributes, 'id' | 'conversationId' | 'output' | 'tokensUsed' | 'latencyMs' | 'errorMessage' | 'status'> {}

export class AgentLog extends Model<AgentLogAttributes, AgentLogCreationAttributes> {
  declare id: string; declare agentConfigId: string; declare conversationId?: string;
  declare input: string; declare output?: string; declare status: string;
}

AgentLog.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  agentConfigId: { type: DataTypes.UUID, allowNull: false },
  conversationId: { type: DataTypes.UUID },
  input: { type: DataTypes.TEXT, allowNull: false },
  output: { type: DataTypes.TEXT },
  tokensUsed: { type: DataTypes.INTEGER },
  latencyMs: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('success', 'error', 'timeout'), defaultValue: 'success' },
  errorMessage: { type: DataTypes.TEXT },
}, { sequelize, modelName: 'AgentLog', tableName: 'agent_logs', updatedAt: false });
