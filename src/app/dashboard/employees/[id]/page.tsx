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
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDoc } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Employee } from '../../data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

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

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId ? doc(firestore, 'employees', employeeId) : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

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
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
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
            onClick={() => router.push(`/dashboard/employees/${employeeId}/edit`)}
            icon={User}
            label="Personal Details"
          />
          <DetailRow icon={Briefcase} label="Current Employment" />
          <DetailRow icon={ClipboardList} label="Custom Details">
            <Badge variant="destructive" className="bg-red-500 text-white">
              New
            </Badge>
          </DetailRow>
          <DetailRow icon={ShieldCheck} label="Background Verification" />
        </div>

        <div className="my-4 space-y-2 px-4">
          <DetailRow icon={CalendarDays} label="Attendance Details" />
          <DetailRow icon={Wallet} label="Salary Details" />
          <DetailRow icon={Landmark} label="Bank Details">
            <Badge variant="destructive" className='bg-red-100 text-red-700'>Not Verified</Badge>
          </DetailRow>
          <DetailRow icon={UserCog} label="User Permission">
            <span className="text-sm text-muted-foreground">Employee</span>
          </DetailRow>
          <DetailRow icon={Clock} label="Penalty & Overtime" />
        </div>

        <div className="space-y-2 px-4">
          <DetailRow icon={BookUser} label="Leave Balances & Policy" />
          <DetailRow icon={FileText} label="Documents" />
          <DetailRow icon={Bell} label="Notifications">
            <Switch defaultChecked />
          </DetailRow>
          <DetailRow icon={Mail} label="Requests" />
          <DetailRow icon={Settings2} label="Additional Settings" />
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
          >
            <UserX className="mr-2 h-4 w-4" /> Make Inactive
          </Button>
          <Button variant="destructive" className="w-full justify-center">
            <Trash2 className="mr-2 h-4 w-4" /> Delete Staff
          </Button>
        </div>
      </main>
    </div>
  );
}
