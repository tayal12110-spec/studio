'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { type Employee } from './data';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase';
import { collection, CollectionReference } from 'firebase/firestore';

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  isLoading: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();

  const employeesCol = useMemoFirebase(
    () => (firestore ? collection(firestore, 'employees') : null),
    [firestore]
  ) as CollectionReference | null;

  const { data: employees, isLoading } = useCollection<Employee>(employeesCol);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    if (employeesCol) {
      addDocumentNonBlocking(employeesCol, employee);
    } else {
      console.error('Firestore collection is not available to add employee.');
    }
  };

  const value = {
    employees: employees || [],
    addEmployee,
    isLoading,
  };

  return (
    <EmployeeContext.Provider value={value}>
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
