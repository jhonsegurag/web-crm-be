import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface ContactNoteAttributes { id: string; contactId: string; authorId: string; content: string; }
interface ContactNoteCreationAttributes extends Optional<ContactNoteAttributes, 'id'> {}

export class ContactNote extends Model<ContactNoteAttributes, ContactNoteCreationAttributes> {
  declare id: string; declare contactId: string; declare authorId: string; declare content: string;
}

ContactNote.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  contactId: { type: DataTypes.UUID, allowNull: false },
  authorId: { type: DataTypes.UUID, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, { sequelize, modelName: 'ContactNote', tableName: 'contact_notes' });
