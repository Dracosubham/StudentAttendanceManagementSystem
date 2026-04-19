import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { subject, date, timeSlot, department, semester, section, records } = req.body;
    const attendance = await Attendance.create({
      subject, teacher: req.user._id, date, timeSlot, department, semester, section,
      records, isSubmitted: true,
    });
    res.status(201).json(attendance);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Attendance already submitted for this session' });
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const { subject, department, semester, section, dateFrom, dateTo, student } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (section) filter.section = section;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    if (student) filter['records.student'] = student;
    if (req.user.role === 'student') filter['records.student'] = req.user._id;

    const records = await Attendance.find(filter)
      .populate('subject', 'name code')
      .populate('teacher', 'name')
      .populate('records.student', 'name rollNo')
      .sort({ date: -1 }).limit(100);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats/:studentId', protect, async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user._id : req.params.studentId;
    const records = await Attendance.find({ 'records.student': studentId }).populate('subject', 'name code');
    const subjectStats = {};
    records.forEach(att => {
      const subKey = att.subject._id.toString();
      if (!subjectStats[subKey]) subjectStats[subKey] = { name: att.subject.name, code: att.subject.code, held: 0, attended: 0, late: 0 };
      subjectStats[subKey].held++;
      const rec = att.records.find(r => r.student.toString() === studentId.toString());
      if (rec && rec.status === 'present') subjectStats[subKey].attended++;
      if (rec && rec.status === 'late') { subjectStats[subKey].attended++; subjectStats[subKey].late++; }
    });
    const stats = Object.values(subjectStats).map(s => ({ ...s, percentage: s.held > 0 ? Math.round((s.attended / s.held) * 100) : 0 }));
    const totalHeld = stats.reduce((a, s) => a + s.held, 0);
    const totalAttended = stats.reduce((a, s) => a + s.attended, 0);
    res.json({
      overall: { held: totalHeld, attended: totalAttended, percentage: totalHeld ? Math.round((totalAttended / totalHeld) * 100) : 0 },
      subjects: stats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/report', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { department, semester, section, dateFrom, dateTo } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (section) filter.section = section;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    const attendanceRecords = await Attendance.find(filter).populate('records.student', 'name rollNo');
    const studentMap = {};
    attendanceRecords.forEach(att => {
      att.records.forEach(rec => {
        const sid = rec.student._id.toString();
        if (!studentMap[sid]) studentMap[sid] = { name: rec.student.name, rollNo: rec.student.rollNo, held: 0, attended: 0 };
        studentMap[sid].held++;
        if (rec.status === 'present' || rec.status === 'late') studentMap[sid].attended++;
      });
    });
    const report = Object.values(studentMap).map(s => ({ ...s, percentage: s.held ? Math.round((s.attended / s.held) * 100) : 0 })).sort((a, b) => a.rollNo.localeCompare(b.rollNo));
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
