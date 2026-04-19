import express from 'express';
import User from '../models/User.js';
import { protect, generateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role }).populate('department');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role,
        department: user.department, rollNo: user.rollNo, empId: user.empId,
        semester: user.semester, section: user.section, designation: user.designation,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('department');
  res.json(user);
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, rollNo, empId, department, semester, section, designation } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role, rollNo, empId, department, semester, section, designation });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
