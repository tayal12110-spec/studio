export type Employee = {
    id: string;
    employeeId: string;
    name: string;
    email: string;
    department: 'Engineering' | 'HR' | 'Marketing' | 'Sales';
    status: 'Active' | 'On Leave' | 'Terminated';
    baseSalary: number;
  };
  
  export const employees: Employee[] = [
    {
      id: 'EMP001',
      employeeId: 'E-12345',
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      department: 'Engineering',
      status: 'Active',
      baseSalary: 90000,
    },
    {
      id: 'EMP002',
      employeeId: 'E-12346',
      name: 'Bob Williams',
      email: 'bob.w@example.com',
      department: 'HR',
      status: 'Active',
      baseSalary: 65000,
    },
    {
      id: 'EMP003',
      employeeId: 'E-12347',
      name: 'Charlie Brown',
      email: 'charlie.b@example.com',
      department: 'Marketing',
      status: 'On Leave',
      baseSalary: 72000,
    },
    {
      id: 'EMP004',
      employeeId: 'E-12348',
      name: 'Diana Prince',
      email: 'diana.p@example.com',
      department: 'Sales',
      status: 'Active',
      baseSalary: 85000,
    },
    {
      id: 'EMP005',
      employeeId: 'E-12349',
      name: 'Ethan Hunt',
      email: 'ethan.h@example.com',
      department: 'Engineering',
      status: 'Terminated',
      baseSalary: 110000,
    },
     {
      id: 'EMP006',
      employeeId: 'E-12350',
      name: 'Fiona Glenanne',
      email: 'fiona.g@example.com',
      department: 'Engineering',
      status: 'Active',
      baseSalary: 95000,
    },
    {
      id: 'EMP007',
      employeeId: 'E-12351',
      name: 'George Costanza',
      email: 'george.c@example.com',
      department: 'Sales',
      status: 'Active',
      baseSalary: 82000,
    },
    {
      id: 'EMP008',
      employeeId: 'E-12352',
      name: 'Hannah Montana',
      email: 'hannah.m@example.com',
      department: 'Marketing',
      status: 'Active',
      baseSalary: 71000,
    },
    {
      id: 'EMP009',
      employeeId: 'E-12353',
      name: 'Ian Malcolm',
      email: 'ian.m@example.com',
      department: 'Engineering',
      status: 'On Leave',
      baseSalary: 120000,
    },
    {
      id: 'EMP010',
      employeeId: 'E-12354',
      name: 'Jessica Rabbit',
      email: 'jessica.r@example.com',
      department: 'HR',
      status: 'Active',
      baseSalary: 68000,
    },
  ];
  