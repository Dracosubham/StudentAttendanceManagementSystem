import express from 'express';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Subject from '../models/Subject.js';
import Class from '../models/Class.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// --- Users ---
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, department, semester, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(filter).select('-password').populate('department', 'name code').sort({ name: 1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('department');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/users — Admin creates a student or teacher
router.post('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role, rollNo, empId, department, semester, section, designation } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role, rollNo, empId, department, semester, section, designation });
    const populated = await User.findById(user._id).select('-password').populate('department', 'name code');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/users/:id — Admin deletes a user
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Departments ---
router.get('/departments', protect, async (req, res) => {
  try {
    const departments = await Department.find().populate('hod', 'name');
    const result = await Promise.all(departments.map(async (d) => {
      const studentCount = await User.countDocuments({ department: d._id, role: 'student' });
      const teacherCount = await User.countDocuments({ department: d._id, role: 'teacher' });
      return { ...d.toObject(), students: studentCount, teachers: teacherCount };
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/departments', protect, authorize('admin'), async (req, res) => {
  try { const dept = await Department.create(req.body); res.status(201).json(dept); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Subjects ---
router.get('/subjects', protect, async (req, res) => {
  try {
    const { department, semester } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    const subjects = await Subject.find(filter).populate('department', 'name code').populate('teacher', 'name');
    res.json(subjects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/subjects', protect, authorize('admin'), async (req, res) => {
  try { const subject = await Subject.create(req.body); res.status(201).json(subject); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Classes ---
router.get('/classes', protect, async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('department', 'name code')
      .populate('classTeacher', 'name empId')
      .populate('students', 'name rollNo email')
      .populate('subjects', 'name code')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/classes', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, department, semester, section, classTeacher, students, subjects, academicYear } = req.body;
    if (!name || !department || !semester || !section) {
      return res.status(400).json({ message: 'Name, department, semester, and section are required' });
    }
    const cls = await Class.create({ name, department, semester, section, classTeacher, students, subjects, academicYear });
    const populated = await Class.findById(cls._id)
      .populate('department', 'name code')
      .populate('classTeacher', 'name empId')
      .populate('students', 'name rollNo email');
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'A class with this department, semester, and section already exists' });
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/classes/:id — Update class (add/remove students, change teacher)
router.put('/classes/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('department', 'name code')
      .populate('classTeacher', 'name empId')
      .populate('students', 'name rollNo email');
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json(cls);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/classes/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Dashboard ---
router.get('/dashboard/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student', status: 'active' });
    const totalTeachers = await User.countDocuments({ role: 'teacher', status: 'active' });
    const totalDepartments = await Department.countDocuments();
    const totalClasses = await Class.countDocuments();
    res.json({ totalStudents, totalTeachers, totalDepartments, totalClasses });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
