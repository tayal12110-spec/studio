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
import { type Staff } from './data';
import Link from 'next/link';
import { useEmployees } from './employee-context';

function Header() {
  return (
    <header className="flex items-center justify-between bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <span className="text-xs font-bold text-muted-foreground">
            ADD LOGO
          </span>
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
          <span>Total Staff - 0</span>
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
    { icon: ClipboardList, label: 'Pending Requests' },
    { icon: UserPlus, label: 'Invite Staff' },
    { icon: Megaphone, label: 'Announcements' },
    { icon: BarChart3, label: 'Reports' },
  ];
  return (
    <div className="mx-4 grid grid-cols-4 gap-4 text-center">
      {actions.map((action) => (
        <div key={action.label} className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-lg bg-card text-primary"
          >
            <action.icon className="h-6 w-6" />
          </Button>
          <p className="text-xs text-muted-foreground">{action.label}</p>
        </div>
      ))}
    </div>
  );
}

function EmployeeList() {
  const { employees } = useEmployees();
  return (
    <div className="mt-4 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Staff on Payroll ({employees.length})</h2>
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
        {employees.map((employee: Staff) => (
          <div
            key={employee.name}
            className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center gap-4">
              <Avatar className="relative h-12 w-12">
                <AvatarFallback className="text-xl">
                  {employee.avatar}
                </AvatarFallback>
                {employee.status === 'Inactive' && (
                  <XCircle className="absolute bottom-0 right-0 h-5 w-5 fill-red-500 text-white" />
                )}
              </Avatar>
              <div>
                <p className="font-semibold">{employee.name}</p>
                {employee.status === 'Active' ? (
                  <p className="text-sm font-medium text-green-600">Active</p>
                ) : (
                  <p className="text-sm font-medium text-red-500">Inactive</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Pay
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="relative">
      <Header />
      <AttendanceSummary />
      <QuickActions />

      <div className="m-4 rounded-lg border border-yellow-300 bg-yellow-100 p-3 text-center text-yellow-800">
        <p>Your Free trial ends today</p>
      </div>

      <EmployeeList />

      <Button
        asChild
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
        size="icon"
      >
        <Link href="/dashboard/add-employee">
          <Plus className="h-8 w-8" />
        </Link>
      </Button>
    </div>
  );
}
