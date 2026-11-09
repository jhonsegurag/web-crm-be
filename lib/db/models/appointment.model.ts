import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface AppointmentAttributes {
  id: string; businessId: string; contactId?: string; assignedTo: string;
  title: string; description?: string; startsAt: Date; endsAt: Date;
  locationText?: string; status: string; reminderMinutes: number;
}
interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id' | 'contactId' | 'description' | 'locationText' | 'status' | 'reminderMinutes'> {}

export class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> {
  declare id: string; declare businessId: string; declare contactId?: string;
  declare assignedTo: string; declare title: string; declare description?: string;
  declare startsAt: Date; declare endsAt: Date; declare locationText?: string;
  declare status: string; declare reminderMinutes: number;
}

Appointment.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessId: { type: DataTypes.UUID, allowNull: false },
  contactId: { type: DataTypes.UUID },
  assignedTo: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  startsAt: { type: DataTypes.DATE, allowNull: false },
  endsAt: { type: DataTypes.DATE, allowNull: false },
  locationText: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'), defaultValue: 'scheduled' },
  reminderMinutes: { type: DataTypes.INTEGER, defaultValue: 30 },
}, { sequelize, modelName: 'Appointment', tableName: 'appointments' });
