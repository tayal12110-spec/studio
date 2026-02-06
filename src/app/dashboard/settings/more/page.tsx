'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  FileText,
  Lightbulb,
  LogOut,
  RefreshCcw,
  Star,
  Building2,
  Bell,
  ThumbsUp,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useFirestore } from '@/firebase';
import { collection, deleteDoc, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const SettingsRow = ({
  icon: Icon,
  label,
  children,
  onClick,
  isDestructive = false,
}: {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
  isDestructive?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 bg-card rounded-lg border ${
        isDestructive ? 'text-destructive' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`h-6 w-6 ${isDestructive ? '' : 'text-muted-foreground'}`} />
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        {children}
        {onClick && <ChevronRight className="h-5 w-5" />}
      </div>
    </div>
  );
};

export default function MoreSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [appNotifications, setAppNotifications] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('abhi');

  const companyCode = 'ULEHLB';
  const appVersion = 'v-6.89';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(companyCode);
    toast({
      title: 'Copied to clipboard!',
      description: `Company code ${companyCode} has been copied.`,
    });
  };

  const handleDeleteAllStaff = async () => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Database connection not found.",
        });
        return;
    }
    setIsDeleting(true);
    try {
        const employeesCol = collection(firestore, 'employees');
        const snapshot = await getDocs(employeesCol);
        if (snapshot.empty) {
          toast({
              title: 'No Staff Found',
              description: 'There are no employee records to delete.',
          });
          setIsDeleting(false);
          setIsDeleteDialogOpen(false);
          return;
        }

        const deletePromises: Promise<void>[] = [];
        snapshot.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
        });
        await Promise.all(deletePromises);
        
        toast({
            title: 'All Staff Deleted',
            description: 'All employee records have been removed.',
        });
    } catch (error) {
        console.error("Error deleting all staff: ", error);
        toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: "An error occurred while deleting staff.",
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    }
  };
  
  const handleSwitchCompany = () => {
    toast({
      title: `Switched to ${selectedCompany}`,
    });
    setIsCompanyDialogOpen(false);
  };
  
  const handleCreateCompany = () => {
    router.push('/dashboard/settings/company/create');
  }

  const menuItems = [
    { icon: ThumbsUp, label: 'Rate Us' },
    { icon: Lightbulb, label: 'Request a feature', onClick: () => router.push('/dashboard/settings/more/request-a-feature') },
    { icon: Building2, label: 'Your Companies', onClick: () => setIsCompanyDialogOpen(true) },
    {
      icon: RefreshCcw,
      label: 'Delete All Staff',
      isDestructive: true,
      onClick: () => setIsDeleteDialogOpen(true),
    },
    { icon: FileText, label: 'Terms & Conditions' },
    { icon: FileText, label: 'Privacy Policy' },
    { icon: LogOut, label: 'Logout', onClick: () => router.push('/') },
  ];

  return (
    <>
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">More Settings</h1>
      </header>
      <main className="flex-1 space-y-6 p-4">
        <div>
          <h2 className="px-2 pb-2 text-lg font-semibold text-muted-foreground">Notifications</h2>
          <SettingsRow icon={Bell} label="App Notifications">
            <Switch
              checked={appNotifications}
              onCheckedChange={setAppNotifications}
            />
          </SettingsRow>
        </div>

        <div>
          <h2 className="px-2 pb-2 text-lg font-semibold text-muted-foreground">Others</h2>
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <SettingsRow
                key={index}
                icon={item.icon}
                label={item.label}
                isDestructive={item.isDestructive}
                onClick={item.onClick}
              >
                {item.onClick ? null : <ChevronRight className="h-5 w-5" />}
              </SettingsRow>
            ))}
          </div>
        </div>

        <div className="pt-4 text-center">
            <Button
                variant="outline"
                className="bg-blue-100/50 border-blue-200 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-300 dark:hover:bg-blue-900/30"
                onClick={copyToClipboard}
            >
                Company Code : {companyCode}
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">{appVersion}</p>
        </div>
      </main>
    </div>

    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will permanently delete all staff members. This cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllStaff} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete All Staff'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    
    <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
        <DialogContent className="sm:max-w-xs">
            <DialogHeader>
                <DialogTitle>Your Companies</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <RadioGroup value={selectedCompany} onValueChange={setSelectedCompany}>
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="abhi" id="company-abhi" />
                        <Label htmlFor="company-abhi" className="font-normal w-full cursor-pointer">
                            <p className="font-semibold">abhi</p>
                            <p className="text-sm text-muted-foreground">Role : Admin</p>
                        </Label>
                    </div>
                </RadioGroup>
                <Button variant="link" className="p-0 h-auto text-primary" onClick={handleCreateCompany}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Company
                </Button>
            </div>
            <DialogFooter className="flex-col gap-2">
                <Button onClick={handleSwitchCompany} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Switch Company</Button>
                <DialogClose asChild>
                  <Button variant="ghost" className="w-full">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
