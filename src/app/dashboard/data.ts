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
