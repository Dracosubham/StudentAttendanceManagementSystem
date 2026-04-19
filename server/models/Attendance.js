import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  remarks: { type: String, default: '' },
});

const attendanceSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  semester: String,
  section: String,
  records: [attendanceRecordSchema],
  isSubmitted: { type: Boolean, default: false },
}, { timestamps: true });

attendanceSchema.index({ subject: 1, date: 1, section: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
