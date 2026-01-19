import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { columns } from './columns';
import { employees } from './data';
import { DataTable } from './components/data-table';

export default function EmployeesPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Employees">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DashboardHeader>
      <main className="flex-1 p-4 md:p-6">
        <DataTable data={employees} columns={columns} />
      </main>
    </div>
  );
}
