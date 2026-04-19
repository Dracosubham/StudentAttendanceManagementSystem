// Mock users
export const users = {
  admin: { id: 1, name: 'Dr. Rajesh Kumar', email: 'admin@sams.edu', role: 'admin', avatar: '👨‍💼' },
  teacher: { id: 2, name: 'Dr. Anita Sharma', email: 'anita.sharma@sams.edu', role: 'teacher', department: 'CSE', designation: 'Associate Professor', avatar: '👩‍🏫' },
  student: { id: 3, name: 'Rahul Sharma', email: 'rahul.sharma@sams.edu', role: 'student', rollNo: '30201220045', department: 'CSE', semester: '5th', section: 'A', avatar: '🎓' }
};

export const departments = [
  { id: 1, name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Rajesh Kumar', students: 420, teachers: 28 },
  { id: 2, name: 'Electronics & Communication', code: 'ECE', hod: 'Dr. Priya Singh', students: 380, teachers: 24 },
  { id: 3, name: 'Mechanical Engineering', code: 'ME', hod: 'Dr. Amit Patel', students: 350, teachers: 22 },
  { id: 4, name: 'Electrical Engineering', code: 'EE', hod: 'Dr. Suresh Verma', students: 310, teachers: 20 },
  { id: 5, name: 'Civil Engineering', code: 'CE', hod: 'Dr. Neha Gupta', students: 280, teachers: 18 },
  { id: 6, name: 'Information Technology', code: 'IT', hod: 'Dr. Vikram Joshi', students: 390, teachers: 26 },
  { id: 7, name: 'Business Administration', code: 'MBA', hod: 'Dr. Kavita Nair', students: 290, teachers: 15 },
  { id: 8, name: 'Applied Sciences', code: 'AS', hod: 'Dr. Mohan Das', students: 180, teachers: 12 },
];

export const subjects = [
  { id: 1, name: 'Data Structures', code: 'CS301', department: 'CSE', semester: '3rd', teacher: 'Dr. Anita Sharma', held: 25, attended: 23, percentage: 92 },
  { id: 2, name: 'Operating Systems', code: 'CS501', department: 'CSE', semester: '5th', teacher: 'Dr. Vikram Joshi', held: 22, attended: 19, percentage: 86 },
  { id: 3, name: 'DBMS', code: 'CS302', department: 'CSE', semester: '3rd', teacher: 'Dr. Priya Singh', held: 24, attended: 17, percentage: 71 },
  { id: 4, name: 'Computer Networks', code: 'CS502', department: 'CSE', semester: '5th', teacher: 'Dr. Suresh Verma', held: 20, attended: 14, percentage: 68 },
  { id: 5, name: 'Software Engineering', code: 'CS503', department: 'CSE', semester: '5th', teacher: 'Dr. Amit Patel', held: 18, attended: 15, percentage: 83 },
  { id: 6, name: 'Mathematics-III', code: 'MA301', department: 'CSE', semester: '3rd', teacher: 'Dr. Mohan Das', held: 26, attended: 14, percentage: 55 },
];

export const students = [
  { id: 1, rollNo: '30201220001', name: 'Aarav Patel', email: 'aarav@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 92, status: 'Active' },
  { id: 2, rollNo: '30201220002', name: 'Diya Singh', email: 'diya@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 88, status: 'Active' },
  { id: 3, rollNo: '30201220003', name: 'Kabir Sharma', email: 'kabir@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 45, status: 'Active' },
  { id: 4, rollNo: '30201220004', name: 'Ananya Gupta', email: 'ananya@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 78, status: 'Active' },
  { id: 5, rollNo: '30201220005', name: 'Rohan Das', email: 'rohan@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 72, status: 'Active' },
  { id: 6, rollNo: '30201220006', name: 'Ishita Nair', email: 'ishita@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 95, status: 'Active' },
  { id: 7, rollNo: '30201220007', name: 'Arjun Verma', email: 'arjun@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 63, status: 'Active' },
  { id: 8, rollNo: '30201220008', name: 'Priya Banerjee', email: 'priya@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 81, status: 'Active' },
  { id: 9, rollNo: '30201220009', name: 'Vikram Jha', email: 'vikram@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 55, status: 'Active' },
  { id: 10, rollNo: '30201220010', name: 'Neha Reddy', email: 'neha@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 90, status: 'Active' },
  { id: 11, rollNo: '30201220011', name: 'Saurabh Mishra', email: 'saurabh@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 67, status: 'Active' },
  { id: 12, rollNo: '30201220012', name: 'Meera Iyer', email: 'meera@sams.edu', department: 'CSE', semester: '3rd', section: 'A', attendance: 84, status: 'Active' },
  { id: 13, rollNo: '30201220013', name: 'Aditya Kumar', email: 'aditya@sams.edu', department: 'ECE', semester: '3rd', section: 'A', attendance: 71, status: 'Active' },
  { id: 14, rollNo: '30201220014', name: 'Shreya Chatterjee', email: 'shreya@sams.edu', department: 'ECE', semester: '3rd', section: 'A', attendance: 93, status: 'Active' },
  { id: 15, rollNo: '30201220015', name: 'Rahul Yadav', email: 'rahul.y@sams.edu', department: 'ME', semester: '5th', section: 'B', attendance: 58, status: 'Active' },
];

export const teachersList = [
  { id: 1, empId: 'FAC001', name: 'Dr. Anita Sharma', email: 'anita@sams.edu', department: 'CSE', designation: 'Associate Professor', subjects: ['Data Structures', 'Algorithms'], status: 'Active' },
  { id: 2, empId: 'FAC002', name: 'Dr. Vikram Joshi', email: 'vikram@sams.edu', department: 'CSE', designation: 'Professor', subjects: ['Operating Systems', 'Cloud Computing'], status: 'Active' },
  { id: 3, empId: 'FAC003', name: 'Dr. Priya Singh', email: 'priya@sams.edu', department: 'ECE', designation: 'Assistant Professor', subjects: ['DBMS', 'Data Mining'], status: 'Active' },
  { id: 4, empId: 'FAC004', name: 'Dr. Suresh Verma', email: 'suresh@sams.edu', department: 'CSE', designation: 'Associate Professor', subjects: ['Computer Networks', 'IoT'], status: 'Active' },
  { id: 5, empId: 'FAC005', name: 'Dr. Amit Patel', email: 'amit@sams.edu', department: 'ME', designation: 'Professor', subjects: ['Software Engineering'], status: 'Active' },
];

export const todaysClasses = [
  { id: 1, time: '9:00 AM', subject: 'Data Structures', class: 'CSE-A, 3rd Sem', room: '302', status: 'completed', present: 42, total: 45 },
  { id: 2, time: '11:00 AM', subject: 'Operating Systems', class: 'CSE-B, 5th Sem', room: '405', status: 'completed', present: 38, total: 42 },
  { id: 3, time: '2:00 PM', subject: 'DBMS Lab', class: 'CSE-A, 3rd Sem', room: 'Lab 201', status: 'in-progress', present: 0, total: 45 },
  { id: 4, time: '4:00 PM', subject: 'Computer Networks', class: 'ECE-A, 5th Sem', room: '310', status: 'upcoming', present: 0, total: 40 },
];

export const attendanceTrend = [
  { week: 'Week 1', attendance: 85 },
  { week: 'Week 2', attendance: 82 },
  { week: 'Week 3', attendance: 88 },
  { week: 'Week 4', attendance: 87 },
  { week: 'Week 5', attendance: 84 },
  { week: 'Week 6', attendance: 89 },
  { week: 'Week 7', attendance: 86 },
  { week: 'Week 8', attendance: 83 },
];

export const departmentAttendance = [
  { name: 'CSE', attendance: 92 },
  { name: 'ECE', attendance: 88 },
  { name: 'IT', attendance: 85 },
  { name: 'ME', attendance: 82 },
  { name: 'EE', attendance: 79 },
  { name: 'CE', attendance: 76 },
  { name: 'MBA', attendance: 74 },
  { name: 'AS', attendance: 80 },
];

export const notifications = [
  { id: 1, type: 'danger', title: '⚠️ Low Attendance Alert — DBMS', desc: 'Your attendance in DBMS has dropped to 68%. You need 5 more classes to reach 75%.', time: '2 hours ago', read: false },
  { id: 2, type: 'warning', title: '📋 Timetable Updated', desc: 'The timetable for CSE-A 5th Semester has been updated. Check your new schedule.', time: '5 hours ago', read: false },
  { id: 3, type: 'success', title: '✅ Attendance Marked', desc: 'Dr. Sharma marked attendance for Data Structures (CSE-A, 3rd Sem). You were marked Present.', time: '1 day ago', read: true },
  { id: 4, type: 'danger', title: '🔴 Critical: Mathematics-III', desc: 'Your Mathematics-III attendance is at 55%. You need 12 more consecutive classes.', time: '1 day ago', read: false },
  { id: 5, type: 'info', title: '🏖️ Holiday Announcement', desc: 'University will remain closed on Jan 26 (Republic Day). No classes scheduled.', time: '2 days ago', read: true },
  { id: 6, type: 'success', title: '📊 Monthly Report Available', desc: 'Your December attendance report is ready for download.', time: '3 days ago', read: true },
  { id: 7, type: 'warning', title: '⏰ Reminder: Computer Networks', desc: 'Attendance for CN is at 68%. Attend all upcoming classes to stay safe.', time: '3 days ago', read: true },
  { id: 8, type: 'info', title: '🆕 New Subject Added', desc: 'Elective: Machine Learning has been added to your 5th semester curriculum.', time: '5 days ago', read: true },
];

export const timetable = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  slots: ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'],
  data: {
    Monday: ['Data Structures|Dr. Sharma|302', 'OS|Dr. Joshi|405', 'DBMS|Dr. Singh|301', 'LUNCH', 'CN|Dr. Verma|310', 'SE Lab|Dr. Patel|Lab 3', '', ''],
    Tuesday: ['Math-III|Dr. Das|201', 'Data Structures|Dr. Sharma|302', '', 'LUNCH', 'DBMS Lab|Dr. Singh|Lab 2', 'DBMS Lab|Dr. Singh|Lab 2', 'OS|Dr. Joshi|405', ''],
    Wednesday: ['CN|Dr. Verma|310', 'SE|Dr. Patel|303', 'Data Structures|Dr. Sharma|302', 'LUNCH', 'Math-III|Dr. Das|201', '', '', ''],
    Thursday: ['OS|Dr. Joshi|405', 'Math-III|Dr. Das|201', 'CN Lab|Dr. Verma|Lab 1', 'LUNCH', 'CN Lab|Dr. Verma|Lab 1', 'SE|Dr. Patel|303', '', ''],
    Friday: ['Data Structures|Dr. Sharma|302', 'DBMS|Dr. Singh|301', 'OS|Dr. Joshi|405', 'LUNCH', 'Math-III|Dr. Das|201', 'SE|Dr. Patel|303', '', ''],
    Saturday: ['SE|Dr. Patel|303', 'CN|Dr. Verma|310', '', 'LUNCH', '', '', '', ''],
  }
};

export const recentActivity = [
  { id: 1, action: 'Dr. Sharma marked attendance for CSE-A 3rd Sem — Data Structures', time: '10 min ago', type: 'attendance' },
  { id: 2, action: 'New student Riya Malhotra added to ECE department', time: '1 hour ago', type: 'user' },
  { id: 3, action: 'Timetable updated for ME 5th Semester', time: '2 hours ago', type: 'timetable' },
  { id: 4, action: 'Dr. Verma submitted attendance edit request for CN class', time: '3 hours ago', type: 'edit' },
  { id: 5, action: 'Monthly attendance report generated for January 2024', time: '5 hours ago', type: 'report' },
];

export const calendarData = (() => {
  const data = {};
  for (let d = 1; d <= 31; d++) {
    const day = d.toString().padStart(2, '0');
    const dayOfWeek = new Date(2024, 0, d).getDay();
    if (dayOfWeek === 0) { data[`2024-01-${day}`] = 'holiday'; }
    else if (d === 26) { data[`2024-01-${day}`] = 'holiday'; }
    else if ([3, 10, 18].includes(d)) { data[`2024-01-${day}`] = 'absent'; }
    else if ([7, 22].includes(d)) { data[`2024-01-${day}`] = 'late'; }
    else { data[`2024-01-${day}`] = 'present'; }
  }
  return data;
})();

export const getAttendanceColor = (pct) => {
  if (pct >= 75) return 'var(--success)';
  if (pct >= 65) return 'var(--warning)';
  return 'var(--danger)';
};

export const getStatusBadge = (pct) => {
  if (pct >= 75) return { class: 'badge-success', label: 'Safe' };
  if (pct >= 65) return { class: 'badge-warning', label: 'Warning' };
  return { class: 'badge-danger', label: 'Danger' };
};
