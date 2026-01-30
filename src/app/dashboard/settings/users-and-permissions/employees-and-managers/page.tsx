'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmployees } from '@/app/dashboard/employee-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Employee } from '@/app/dashboard/data';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';


type RoleFilter = 'All' | 'Employee' | 'Branch Admin' | 'Attendance Manager' | 'Advanced Attendance Manager';

const roles: RoleFilter[] = ['All', 'Employee', 'Branch Admin', 'Attendance Manager', 'Advanced Attendance Manager'];

export default function UpdateRolesPage() {
  const router = useRouter();
  const { employees, isLoading } = useEmployees();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('All');
  const [isPermissionSheetOpen, setIsPermissionSheetOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<Employee['permission']>('Employee');

  const permissionDescriptions: Record<string, string> = {
    'Employee': 'Employee : Can mark their own attendance only.',
    'Attendance Manager': 'Attendance Manager: Can mark attendance for other staff.',
    'Branch Admin': 'Branch Admin: Has all access for this branch.',
  };


  const handleEditRoleClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedPermission(employee.permission || 'Employee');
    setIsPermissionSheetOpen(true);
  };

  const handlePermissionSave = () => {
    if (!firestore || !selectedEmployee) return;

    const employeeRef = doc(firestore, 'employees', selectedEmployee.id);
    updateDocumentNonBlocking(employeeRef, { permission: selectedPermission });
    
    toast({
      title: 'Permission Updated',
      description: `${selectedEmployee.name}'s permission has been set to ${selectedPermission}.`,
    });
    setIsPermissionSheetOpen(false);
    setSelectedEmployee(null);
  };


  const filteredEmployees = employees.filter(employee => {
    const nameMatch = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return nameMatch;
    if (activeFilter === 'Advanced Attendance Manager') {
        return nameMatch && (employee.permission === 'Attendance Manager' || employee.permission === 'Advanced Attendance Manager');
    }
    return nameMatch && employee.permission === activeFilter;
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (employees.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          <p>No employees found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between bg-card p-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">{employee.avatar || employee.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.permission || 'Employee'}</p>
              </div>
            </div>
            <Button variant="outline" className="bg-accent/10 border-accent text-accent hover:bg-accent/20" onClick={() => handleEditRoleClick(employee)}>
              EDIT ROLE
            </Button>
          </div>
        ))}
         {filteredEmployees.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>No employees match your search.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center">
            <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
            >
            <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-lg font-semibold">Update Roles</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              All Branches <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Branches</DropdownMenuItem>
            <DropdownMenuItem>Main</DropdownMenuItem>
            <DropdownMenuItem>tit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {roles.map((role) => (
            <Button
              key={role}
              variant={activeFilter === role ? 'default' : 'outline'}
              onClick={() => setActiveFilter(role)}
              className={cn(
                  'rounded-full px-4 h-auto py-1',
                  activeFilter === role && 'bg-primary text-primary-foreground'
              )}
            >
              {role}
            </Button>
          ))}
        </div>
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Search employee"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        {renderContent()}
      </main>
    </div>
    
    <Sheet
        open={isPermissionSheetOpen}
        onOpenChange={setIsPermissionSheetOpen}
      >
        <SheetContent
          side="bottom"
          className="mx-auto w-full rounded-t-lg p-0 sm:max-w-lg"
        >
          <div className="p-6">
            <SheetHeader className="mb-4 text-left">
              <SheetTitle className="text-xl font-semibold">
                Select Permission
              </SheetTitle>
            </SheetHeader>
            <RadioGroup
              value={selectedPermission}
              onValueChange={(value: any) => setSelectedPermission(value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem value="Employee" id="r1" />
                <Label
                  htmlFor="r1"
                  className="w-full cursor-pointer text-base font-normal"
                >
                  Employee
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem value="Attendance Manager" id="r2" />
                <Label
                  htmlFor="r2"
                  className="w-full cursor-pointer text-base font-normal"
                >
                  Attendance Manager
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem value="Branch Admin" id="r3" />
                <Label
                  htmlFor="r3"
                  className="w-full cursor-pointer text-base font-normal"
                >
                  Branch Admin
                </Label>
              </div>
            </RadioGroup>

            {selectedPermission && (
              <div className="mt-6 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
                {permissionDescriptions[selectedPermission]}
              </div>
            )}
          </div>
          <SheetFooter className="border-t bg-card p-4">
            <Button
              onClick={handlePermissionSave}
              className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Update Permission
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
