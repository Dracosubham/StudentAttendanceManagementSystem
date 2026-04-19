import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  rollNo: { type: String, sparse: true, unique: true },
  semester: String,
  section: String,
  empId: { type: String, sparse: true, unique: true },
  designation: String,
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
