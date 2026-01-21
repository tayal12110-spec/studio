'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type Staff, staff as initialStaff } from './data';

interface EmployeeContextType {
  employees: Staff[];
  addEmployee: (employee: Staff) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Staff[]>(initialStaff);

  const addEmployee = (employee: Staff) => {
    setEmployees(prevEmployees => [...prevEmployees, employee]);
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
}
