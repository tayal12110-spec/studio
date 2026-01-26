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
  personalEmail?: string;
  dateOfBirth?: string; // Storing as string 'YYYY-MM-DD'
  gender?: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Unmarried' | 'Married' | 'Divorced' | 'Widowed';
  bloodGroup?: string;
  guardianName?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactMobile?: string;
  emergencyContactAddress?: string;
  branch?: string;
  employeeType?: 'Full Time' | 'Part Time' | 'Contract';
  jobTitle?: string;
  dateOfJoining?: string; // YYYY-MM-DD
  dateOfLeaving?: string; // YYYY-MM-DD
  pfAccountNumber?: string;
  esiAccountNumber?: string;
  customFields?: Record<string, string>;
};

export type AttendanceStatus = 'ABSENT' | 'HALF DAY' | 'PRESENT' | 'WEEK OFF' | 'HOLIDAY' | 'PAID LEAVE' | 'HALF DAY LEAVE' | 'UNPAID LEAVE';

export type Attendance = {
  employeeId: string;
  date: string; // 'yyyy-MM-dd'
  status: AttendanceStatus;
  note?: string;
};
