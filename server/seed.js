import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Department from './models/Department.js';
import Subject from './models/Subject.js';
import Attendance from './models/Attendance.js';

const seed = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sams_attendance';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB, seeding...');

  await Promise.all([User.deleteMany(), Department.deleteMany(), Subject.deleteMany(), Attendance.deleteMany()]);

  const depts = await Department.insertMany([
    { name: 'Computer Science & Engineering', code: 'CSE' },
    { name: 'Electronics & Communication', code: 'ECE' },
    { name: 'Mechanical Engineering', code: 'ME' },
    { name: 'Electrical Engineering', code: 'EE' },
    { name: 'Civil Engineering', code: 'CE' },
    { name: 'Information Technology', code: 'IT' },
    { name: 'Business Administration', code: 'MBA' },
    { name: 'Applied Sciences', code: 'AS' },
  ]);
  const cse = depts.find(d => d.code === 'CSE');
  console.log('✅ Departments created');

  const admin = await User.create({
    name: 'Dr. Rajesh Kumar', email: 'admin@sams.edu', password: 'admin123',
    role: 'admin', department: cse._id,
  });

  const teacher1 = await User.create({
    name: 'Dr. Anita Sharma', email: 'anita@sams.edu', password: 'teacher123',
    role: 'teacher', empId: 'FAC001', department: cse._id, designation: 'Associate Professor',
  });
  const teacher2 = await User.create({
    name: 'Dr. Vikram Joshi', email: 'vikram@sams.edu', password: 'teacher123',
    role: 'teacher', empId: 'FAC002', department: cse._id, designation: 'Professor',
  });
  console.log('✅ Teachers created');

  const subjs = await Subject.insertMany([
    { name: 'Data Structures', code: 'CS301', department: cse._id, semester: '3rd', teacher: teacher1._id },
    { name: 'Operating Systems', code: 'CS501', department: cse._id, semester: '5th', teacher: teacher2._id },
    { name: 'DBMS', code: 'CS302', department: cse._id, semester: '3rd', teacher: teacher1._id },
    { name: 'Computer Networks', code: 'CS502', department: cse._id, semester: '5th', teacher: teacher2._id },
    { name: 'Software Engineering', code: 'CS503', department: cse._id, semester: '5th', teacher: teacher1._id },
    { name: 'Mathematics-III', code: 'MA301', department: cse._id, semester: '3rd', teacher: teacher2._id },
  ]);
  console.log('✅ Subjects created');

  const studentNames = [
    'Aarav Patel', 'Diya Singh', 'Kabir Sharma', 'Ananya Gupta', 'Rohan Das',
    'Ishita Nair', 'Arjun Verma', 'Priya Banerjee', 'Vikram Jha', 'Neha Reddy',
    'Saurabh Mishra', 'Meera Iyer', 'Aditya Kumar', 'Shreya Chatterjee', 'Rahul Yadav',
  ];

  const studentDocs = [];
  for (let i = 0; i < studentNames.length; i++) {
    const s = await User.create({
      name: studentNames[i],
      email: `${studentNames[i].toLowerCase().replace(/\s/g, '.')}@sams.edu`,
      password: 'student123',
      role: 'student',
      rollNo: `302012200${String(i + 1).padStart(2, '0')}`,
      department: cse._id, semester: '3rd', section: 'A',
    });
    studentDocs.push(s);
  }

  const demoStudent = await User.create({
    name: 'Rahul Sharma', email: 'rahul.sharma@sams.edu', password: 'student123',
    role: 'student', rollNo: '30201220045', department: cse._id, semester: '5th', section: 'A',
  });
  console.log('✅ Students created');

  const allStudents = [...studentDocs, demoStudent];
  for (const subj of subjs) {
    for (let dayOffset = 1; dayOffset <= 25; dayOffset++) {
      const date = new Date(2024, 0, dayOffset);
      if (date.getDay() === 0) continue;
      const records = allStudents.map(s => ({
        student: s._id,
        status: Math.random() > 0.15 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late'),
      }));
      try {
        await Attendance.create({
          subject: subj._id, teacher: subj.teacher, date,
          department: cse._id, semester: subj.semester, section: 'A',
          records, isSubmitted: true,
        });
      } catch (e) { /* duplicate, skip */ }
    }
  }
  console.log('✅ Attendance records created');

  await Department.findByIdAndUpdate(cse._id, { hod: admin._id });

  console.log('\n🎉 Seed complete!');
  console.log('Login credentials:');
  console.log('  Admin:   admin@sams.edu / admin123');
  console.log('  Teacher: anita@sams.edu / teacher123');
  console.log('  Student: rahul.sharma@sams.edu / student123');

  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
