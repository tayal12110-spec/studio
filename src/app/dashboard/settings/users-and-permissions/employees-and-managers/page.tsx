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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';


type RoleFilter = 'All' | 'Employee' | 'Branch Admin' | 'Attendance Manager' | 'Regular' | 'Advanced';

const roles: RoleFilter[] = ['All', 'Employee', 'Branch Admin', 'Attendance Manager', 'Regular', 'Advanced'];

const permissionOptions: {value: Employee['permission'], label: string, description: string}[] = [
    { value: 'Branch Admin', label: 'Branch Admin', description: 'Mark attendance & salary of all employees' },
    { value: 'Attendance Manager', label: 'Attendance Manager', description: 'Mark attendance of all employees' },
    { value: 'Regular', label: 'Regular', description: "Only today's attendance" },
    { value: 'Advanced', label: 'Advanced', description: "Any day's attendance" },
    { value: 'Employee', label: 'Employee', description: 'Mark their own attendance' }
];

export default function UpdateRolesPage() {
  const router = useRouter();
  const { employees, isLoading } = useEmployees();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('All');
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<Employee['permission']>('Employee');

  const handleEditRoleClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedPermission(employee.permission || 'Employee');
    setIsPermissionDialogOpen(true);
  };

  const handlePermissionSave = () => {
    if (!firestore || !selectedEmployee) return;

    const employeeRef = doc(firestore, 'employees', selectedEmployee.id);
    updateDocumentNonBlocking(employeeRef, { permission: selectedPermission });
    
    toast({
      title: 'Permission Updated',
      description: `${selectedEmployee.name}'s permission has been set to ${selectedPermission}.`,
    });
    setIsPermissionDialogOpen(false);
    setSelectedEmployee(null);
  };


  const filteredEmployees = employees.filter(employee => {
    const nameMatch = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return nameMatch;
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
    
    <Dialog
        open={isPermissionDialogOpen}
        onOpenChange={setIsPermissionDialogOpen}
      >
        <DialogContent
          className="p-0"
        >
          <div className="p-6">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-xl font-semibold">
                Select Role
              </DialogTitle>
            </DialogHeader>
            <RadioGroup
              value={selectedPermission}
              onValueChange={(value: any) => setSelectedPermission(value)}
              className="space-y-4"
            >
              {permissionOptions.map(option => (
                <Label key={option.value} htmlFor={option.value} className="flex items-start space-x-4 rounded-lg border p-4 cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                  <RadioGroupItem value={option.value!} id={option.value} className="mt-1"/>
                  <div className="grid gap-1.5">
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter className="border-t bg-card p-4 grid grid-cols-2 gap-2">
            <DialogClose asChild>
                <Button variant="ghost" className="h-11">CLOSE</Button>
            </DialogClose>
            <Button
              onClick={handlePermissionSave}
              className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              UPDATE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
