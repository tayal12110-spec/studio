'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './components/data-table';
import { useEmployees } from '../employee-context';
import Link from 'next/link';

export default function EmployeesPage() {
  const { employees, isLoading } = useEmployees();

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
      <main className="flex-1 p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-4 text-muted-foreground">Loading employees...</span>
          </div>
        ) : (
          <DataTable data={employees} columns={columns} />
        )}
      </main>
    </div>
  );
}
