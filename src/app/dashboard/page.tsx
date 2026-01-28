'use client';

import {
  Bell,
  ChevronDown,
  HelpCircle,
  ClipboardList,
  UserPlus,
  Megaphone,
  BarChart3,
  Search,
  SlidersHorizontal,
  Plus,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { type Employee } from './data';
import Link from 'next/link';
import { useEmployees } from './employee-context';
import { useState } from 'react';
import { PayrollDialog } from './employees/components/payroll-dialog';

function Header() {
  return (
    <header className="flex items-center justify-between bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <span className="text-xs font-bold text-muted-foreground">
            ADD LOGO
          </span>
          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Plus className="h-3 w-3" />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-lg font-semibold">
              All Branches <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Branch 1</DropdownMenuItem>
            <DropdownMenuItem>Branch 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>
        <Button>
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </Button>
      </div>
    </header>
  );
}

function AttendanceSummary() {
  const { employees } = useEmployees();
  return (
    <Card className="m-4 bg-primary text-primary-foreground">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 text-center">
          <div className="border-r border-primary-foreground/30">
            <p className="text-sm">In</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="border-r border-primary-foreground/30">
            <p className="text-sm">Out</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div>
            <p className="text-sm">No Punch In</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Total Staff - {employees.length}</span>
          <a href="#" className="font-semibold">
            Edit Attendance &gt;&gt;
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    { icon: ClipboardList, label: 'Pending Requests', href: '#' },
    { icon: UserPlus, label: 'Invite Staff', href: '/dashboard/add-employee' },
    { icon: Megaphone, label: 'Announcements', href: '#' },
    { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
  ];
  return (
    <div className="mx-4 grid grid-cols-4 gap-4 text-center">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="flex flex-col items-center gap-1 rounded-lg p-2 transition-colors hover:bg-muted"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card text-primary">
            <action.icon className="h-6 w-6" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{action.label}</p>
        </Link>
      ))}
    </div>
  );
}

function EmployeeList() {
  const { employees, isLoading } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);

  const handlePayClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsPayrollDialogOpen(true);
  };

  return (
    <>
      <div className="mt-4 bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Staff on Payroll ({employees.length})
          </h2>
          <Link
            href="/dashboard/employees"
            className="text-sm font-semibold text-primary"
          >
            View All
          </Link>
        </div>
        <div className="relative mb-4 flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search employee" className="pl-10" />
          <Button variant="ghost" size="icon" className="ml-2">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : employees.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No employees found.
            </p>
          ) : (
            employees.map((employee: Employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
              >
                <Link href={`/dashboard/employees/${employee.id}`} className="flex items-center gap-4 group">
                  <Avatar className="relative h-12 w-12">
                    <AvatarFallback className="text-xl">
                      {employee.avatar}
                    </AvatarFallback>
                    {employee.status === 'Inactive' && (
                      <XCircle className="absolute bottom-0 right-0 h-5 w-5 fill-red-500 text-white" />
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold group-hover:underline">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.status}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" asChild>
                       <Link href={`/dashboard/employees/${employee.id}/attendance`}>View</Link>
                   </Button>
                   <Button size="sm" onClick={() => handlePayClick(employee)}>Pay</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedEmployee && (
        <PayrollDialog
          isOpen={isPayrollDialogOpen}
          setIsOpen={setIsPayrollDialogOpen}
          employee={selectedEmployee}
        />
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="relative pb-24">
      <Header />
      <AttendanceSummary />
      <QuickActions />

      <div className="m-4 rounded-lg border border-yellow-300 bg-yellow-100 p-3 text-center text-yellow-800">
        <p>3 days left in your Free Trial.</p>
      </div>

      <EmployeeList />

      <Button
        asChild
        className="fixed bottom-24 right-4 h-auto rounded-full bg-accent px-4 py-2 text-base text-accent-foreground shadow-lg hover:bg-accent/90"
      >
        <Link href="/dashboard/add-employee">
          <Plus className="mr-2 h-5 w-5" />
          Add Staff
        </Link>
      </Button>
    </div>
  );
}
