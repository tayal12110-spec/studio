export type Employee = {
  id: string; // Firestore document ID
  employeeId: string;
  name: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Terminated' | 'Inactive';
  avatar: string;
  phoneNumber?: string;
  department: 'Engineering' | 'HR' | 'Marketing' | 'Sales';
  baseSalary: number;
};

export type AttendanceStatus = 'ABSENT' | 'HALF DAY' | 'PRESENT' | 'WEEK OFF' | 'HOLIDAY' | 'PAID LEAVE' | 'HALF DAY LEAVE' | 'UNPAID LEAVE';

export type Attendance = {
  employeeId: string;
  date: string; // 'yyyy-MM-dd'
  status: AttendanceStatus;
  note?: string;
};
