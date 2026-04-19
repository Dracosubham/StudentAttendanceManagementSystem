import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  semester: { type: String, required: true },
  section: { type: String, required: true },
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  academicYear: { type: String, default: '2024-25' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

classSchema.index({ department: 1, semester: 1, section: 1 }, { unique: true });

export default mongoose.model('Class', classSchema);
