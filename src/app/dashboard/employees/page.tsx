'use client';

import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Users } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './components/data-table';
import { useEmployees } from '../employee-context';

export default function EmployeesPage() {
  const { employees, isLoading } = useEmployees();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-4 text-muted-foreground">
            Loading employees...
          </span>
        </div>
      );
    }

    if (employees.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20 py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No employees yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by adding your first employee record.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Adding an employee will create the 'employees' collection in your
            database.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/add-employee">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Employee
            </Link>
          </Button>
        </div>
      );
    }

    return <DataTable data={employees} columns={columns} />;
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Employees">
        <Button asChild>
          <Link href="/dashboard/add-employee">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </DashboardHeader>
      <main className="flex-1 p-4 md:p-6">{renderContent()}</main>
    </div>
  );
}
