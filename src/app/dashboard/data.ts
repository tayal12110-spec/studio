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
  aadhaarNumber?: string;
  panNumber?: string;
  drivingLicenseNumber?: string;
  voterIdNumber?: string;
  uanNumber?: string;
  currentAddress?: string;
  permanentAddress?: string;
  canViewOwnAttendance?: boolean;
  pastEmployment?: {
    companyName: string;
    designation: string;
    joiningDate: string;
    leavingDate: string;
    currency?: string;
    salary?: number;
    companyGst?: string;
  } | string; // string for backward compatibility
  accountHolderName?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  upiId?: string;
  permission?: 'Employee' | 'Attendance Manager' | 'Branch Admin';
  penaltyAndOvertime?: {
    lateComing?: {
      allowedDays?: number;
      gracePeriod?: string;
      deductionType?: 'day' | 'hour';
      deductionRate?: number;
    };
    earlyLeaving?: {
      allowedDays?: number;
      gracePeriod?: string;
      deductionType?: 'day' | 'hour';
      deductionRate?: number;
    };
    overtime?: {
      weekOffPay?: string;
      publicHolidayPay?: string;
      extraHoursPay?: string;
      gracePeriod?: string;
    };
  };
  leaveBalances?: {
    privileged: number;
    sick: number;
    casual: number;
  };
  notificationsEnabled?: boolean;
  canUseLocationTracking?: boolean;
  canUseCrmLite?: boolean;
};

export type AttendanceStatus = 'ABSENT' | 'HALF DAY' | 'PRESENT' | 'WEEK OFF' | 'HOLIDAY' | 'PAID LEAVE' | 'HALF DAY LEAVE' | 'UNPAID LEAVE';

export type Attendance = {
  employeeId: string;
  date: string; // 'yyyy-MM-dd'
  status: AttendanceStatus;
  note?: string;
};

export type Document = {
  id: string; // Firestore document ID
  employeeId: string;
  name: string;
  fileUrl: string;
  createdAt: string; // ISO string
};

export type LeaveRequest = {
    id: string; // Firestore document ID
    employeeId: string;
    leaveType: 'Privileged' | 'Sick' | 'Casual';
    startDate: string; // ISO String
    endDate: string; // ISO String
    reason?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string; // ISO string
}

export type ReimbursementRequest = {
    id: string; // Firestore document ID
    employeeId: string;
    amount: number;
    reason?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string; // ISO string
};

export type Branch = {
  id: string; // Firestore document ID
  name: string;
  address: string;
  radius: number;
};
