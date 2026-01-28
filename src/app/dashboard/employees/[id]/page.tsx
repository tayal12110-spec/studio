'use client';

import {
  ArrowLeft,
  User,
  Briefcase,
  ClipboardList,
  ShieldCheck,
  CalendarDays,
  Wallet,
  Landmark,
  UserCog,
  Clock,
  BookUser,
  FileText,
  Bell,
  Mail,
  Settings2,
  ChevronRight,
  Phone,
  MessageSquare,
  Share2,
  MapPin,
  Handshake,
  RefreshCw,
  UserX,
  Trash2,
  Camera,
  Loader2,
  FileDown,
  Calendar as CalendarIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  useDoc,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Employee } from '../../data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DetailRow = ({
  icon,
  label,
  children,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  const Icon = icon;
  const content = (
    <Card onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {children}
          {onClick && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
        </div>
      </CardContent>
    </Card>
  );

  return content;
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId ? doc(firestore, 'employees', employeeId) : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const [isPermissionSheetOpen, setIsPermissionSheetOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Employee['permission']>('Employee');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isInactiveDialogOpen, setIsInactiveDialogOpen] = useState(false);
  const [dateOfLeaving, setDateOfLeaving] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    if (employee) {
      if (employee.permission) {
        setSelectedPermission(employee.permission);
      }
      setNotificationsEnabled(employee.notificationsEnabled ?? true);
    }
  }, [employee]);

  const handlePermissionSave = () => {
    if (!employeeRef || !employee) return;
    updateDocumentNonBlocking(employeeRef, { permission: selectedPermission });
    toast({
      title: 'Permission Updated',
      description: `${employee.name}'s permission has been set to ${selectedPermission}.`,
    });
    setIsPermissionSheetOpen(false);
  };

  const handleNotificationToggle = (checked: boolean) => {
    if (!employeeRef || !employee) return;
    setNotificationsEnabled(checked);
    updateDocumentNonBlocking(employeeRef, { notificationsEnabled: checked });
    toast({
      title: 'Notifications Updated',
      description: `${employee.name} will ${
        checked ? 'now' : 'no longer'
      } receive notifications.`,
    });
  };

  const handleDeactivate = () => {
    if (!employeeRef || !dateOfLeaving) {
      toast({
        variant: 'destructive',
        title: 'Date of leaving is required',
      });
      return;
    }

    updateDocumentNonBlocking(employeeRef, {
      status: 'Inactive',
      dateOfLeaving: format(dateOfLeaving, 'yyyy-MM-dd'),
    });

    toast({
      title: 'Employee Deactivated',
      description: `${employee?.name} has been marked as inactive.`,
    });
    setIsInactiveDialogOpen(false);
  };

  const handleDelete = () => {
    if (!employeeRef || !employee) return;
    deleteDocumentNonBlocking(employeeRef);
    toast({
      title: 'Employee Deleted',
      description: `${employee.name} has been permanently deleted.`,
    });
    router.push('/dashboard/employees');
  };

  const permissionDescriptions: Record<string, string> = {
    Employee: 'Employee : Can mark their own attendance only.',
    'Attendance Manager':
      'Attendance Manager: Can mark attendance for other staff.',
    'Branch Admin': 'Branch Admin: Has all access for this branch.',
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!employee) {
    return <div className="p-4 text-center">Employee not found.</div>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-gray-950">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/employees">
              <Button variant="ghost" size="icon" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-semibold">{employee.name}</h1>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <FileText className="mr-2 h-4 w-4" />
            Biodata
          </Button>
        </header>

        <main className="flex-1 pb-24">
          <div className="flex flex-col items-center bg-card p-6 text-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarFallback className="bg-primary text-4xl font-bold text-primary-foreground">
                  {employee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-card"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="mt-4 text-xl font-bold">{employee.name}</h2>
            <p className="text-muted-foreground">{employee.phoneNumber}</p>
          </div>

          <div className="my-4 grid grid-cols-5 gap-2 px-4 text-center">
            {[
              { icon: Phone, label: 'Call' },
              { icon: MessageSquare, label: 'Text' },
              { icon: Share2, label: 'Invite' },
              { icon: MapPin, label: 'Location' },
              { icon: Handshake, label: 'CRM' },
            ].map((action) => (
              <div key={action.label} className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-lg bg-card"
                >
                  <action.icon className="h-5 w-5 text-primary" />
                </Button>
                <span className="mt-1 text-xs text-muted-foreground">
                  {action.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 px-4">
            <DetailRow
              onClick={() =>
                router.push(`/dashboard/employees/${employeeId}/edit`)
              }
              icon={User}
              label="Personal Details"
            />
            <DetailRow
              onClick={() =>
                router.push(
                  `/dashboard/employees/${employeeId}/current-employment`
                )
              }
              icon={Briefcase}
              label="Current Employment"
            />
            <DetailRow
              onClick={() =>
                router.push(
                  `/dashboard/employees/${employeeId}/custom-details`
                )
              }
              icon={ClipboardList}
              label="Custom Details"
            >
              <Badge variant="destructive" className="bg-red-500 text-white">
                New
              </Badge>
            </DetailRow>
            <DetailRow
              icon={ShieldCheck}
              label="Background Verification"
              onClick={() =>
                router.push(
                  `/dashboard/employees/${employeeId}/background-verification`
                )
              }
            />
          </div>

          <div className="my-4 space-y-2 px-4">
            <DetailRow
              icon={CalendarDays}
              label="Attendance Details"
              onClick={() =>
                router.push(
                  `/dashboard/employees/${employeeId}/attendance-details`
                )
              }
            />
            <DetailRow
              icon={Wallet}
              label="Salary Details"
              onClick={() =>
                router.push(
                  `/dashboard/employees/${employeeId}/salary-details`
                )
              }
            />
            <DetailRow
              icon={Landmark}
              label="Bank Details"
              onClick={() =>
                router.push(`/dashboard/employees/${employeeId}/bank-details`)
              }
            >
              {!(employee.accountNumber || employee.upiId) && (
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-700"
                >
                  Not Added
                </Badge>
              )}
            </DetailRow>
            <DetailRow
              icon={UserCog}
              label="User Permission"
              onClick={() => setIsPermissionSheetOpen(true)}
            >
              <span className="text-sm text-muted-foreground">
                {employee.permission || 'Employee'}
              </span>
            </DetailRow>
            <DetailRow
              icon={Clock}
              label="Penalty &amp; Overtime"
              onClick={() =>
                router.push(
                  `/dashboard/employees/${employeeId}/penalty-overtime`
                )
              }
            />
          </div>

          <div className="space-y-2 px-4">
            <DetailRow
              icon={BookUser}
              label="Leave Balances &amp; Policy"
              onClick={() =>
                router.push(
                  `/dashboard/employees/${employeeId}/leave-balances-policy`
                )
              }
            />
            <DetailRow
              icon={FileText}
              label="Documents"
              onClick={() =>
                router.push(`/dashboard/employees/${employeeId}/documents`)
              }
            />
            <DetailRow icon={Bell} label="Notifications">
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
              />
            </DetailRow>
            <DetailRow
              icon={Mail}
              label="Requests"
              onClick={() =>
                router.push(`/dashboard/employees/${employeeId}/requests`)
              }
            />
            <DetailRow
              icon={Settings2}
              label="Additional Settings"
              onClick={() =>
                router.push(
                  `/dashboard/employees/${employeeId}/additional-settings`
                )
              }
            />
          </div>

          <div className="mt-8 space-y-3 px-4">
            <Button
              variant="outline"
              className="w-full justify-center bg-card text-foreground"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Login OTP
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center bg-card text-foreground"
              onClick={() => setIsInactiveDialogOpen(true)}
            >
              <UserX className="mr-2 h-4 w-4" /> Make Inactive
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-center">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Staff
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This employee will be deleted permanently. Data cannot be
                    recovered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    YES, DELETE
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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

      <Dialog
        open={isInactiveDialogOpen}
        onOpenChange={setIsInactiveDialogOpen}
      >
        <DialogContent className="p-0 sm:max-w-sm">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-center text-xl font-bold">
              Mark as Inactive
            </DialogTitle>
            <DialogDescription className="pt-2 text-center text-muted-foreground">
              Deactivate employee if they left the company. All data is 100%
              backed up.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 px-6 pb-6">
            <Label htmlFor="date-of-leaving">Date of Leaving *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-of-leaving"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dateOfLeaving && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfLeaving ? (
                    format(dateOfLeaving, 'dd MMM yyyy')
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateOfLeaving}
                  onSelect={setDateOfLeaving}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter className="flex-col gap-2 p-4 pt-0">
            <Button
              onClick={handleDeactivate}
              className="h-11 w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={!dateOfLeaving}
            >
              Deactivate
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="w-full">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
