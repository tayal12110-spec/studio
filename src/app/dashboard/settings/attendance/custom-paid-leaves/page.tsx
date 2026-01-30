'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type LeaveType = {
  name: string;
  avatarChar: string;
  avatarColor: string;
};

const initialLeaveTypes: LeaveType[] = [
  { name: 'Casual Leave', avatarChar: 'C', avatarColor: 'bg-green-500' },
  { name: 'Privileged Leave', avatarChar: 'P', avatarColor: 'bg-pink-500' },
  { name: 'Sick Leave', avatarChar: 'S', avatarColor: 'bg-green-500' },
];

const LeaveTypeItem = ({ 
  leaveType,
  onEdit,
  onDelete,
}: { 
  leaveType: LeaveType;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Card>
    <CardContent className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback
            className={`${leaveType.avatarColor} text-white font-semibold`}
          >
            {leaveType.avatarChar}
          </AvatarFallback>
        </Avatar>
        <p className="font-medium text-base">{leaveType.name}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardContent>
  </Card>
);

export default function CustomPaidLeavesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [leaves, setLeaves] = useState<LeaveType[]>(initialLeaveTypes);

  // State for Add Sheet
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [newLeaveName, setNewLeaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // State for Update Sheet
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveType | null>(null);
  const [updatedLeaveName, setUpdatedLeaveName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddLeave = () => {
    if (!newLeaveName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Leave name is required',
      });
      return;
    }
    setIsSaving(true);

    setTimeout(() => {
      const newLeave: LeaveType = {
        name: newLeaveName,
        avatarChar: newLeaveName.charAt(0).toUpperCase(),
        avatarColor: 'bg-blue-500',
      };
      setLeaves((prev) => [...prev, newLeave]);

      toast({
        title: 'Leave Added!',
        description: `"${newLeaveName}" has been added.`,
      });

      setIsSaving(false);
      setIsAddSheetOpen(false);
      setNewLeaveName('');
    }, 500);
  };
  
  const openAddSheet = () => {
    setNewLeaveName('');
    setIsAddSheetOpen(true);
  };

  const openUpdateSheet = (leave: LeaveType) => {
    setEditingLeave(leave);
    setUpdatedLeaveName(leave.name);
    setIsUpdateSheetOpen(true);
  };

  const handleUpdateLeave = () => {
    if (!updatedLeaveName.trim() || !editingLeave) return;
    setIsUpdating(true);

    setTimeout(() => {
      setLeaves(prev => prev.map(l => 
        l.name === editingLeave.name 
          ? { ...l, name: updatedLeaveName, avatarChar: updatedLeaveName.charAt(0).toUpperCase() }
          : l
      ));
      toast({
        title: 'Leave Updated!',
        description: `"${editingLeave.name}" has been updated to "${updatedLeaveName}".`,
      });
      setIsUpdating(false);
      setIsUpdateSheetOpen(false);
    }, 500);
  };
  
  const handleDeleteLeave = (leaveToDelete: LeaveType) => {
    setLeaves(prev => prev.filter(l => l.name !== leaveToDelete.name));
    toast({
        title: 'Leave Deleted',
        description: `"${leaveToDelete.name}" has been deleted.`,
        variant: 'destructive',
    });
  };

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
          <h1 className="ml-4 text-lg font-semibold">Custom Paid Leaves</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          <div className="space-y-3">
            {leaves.map((leave) => (
              <LeaveTypeItem
                key={leave.name}
                leaveType={leave}
                onEdit={() => openUpdateSheet(leave)}
                onDelete={() => handleDeleteLeave(leave)}
              />
            ))}
          </div>
        </main>
        <footer className="sticky bottom-0 border-t bg-card p-4">
          <Button
            onClick={openAddSheet}
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Leave
          </Button>
        </footer>
      </div>

      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md"
        >
          <SheetHeader className="p-6 pb-2 text-center">
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
            <SheetTitle>Add New Leave</SheetTitle>
          </SheetHeader>
          <div className="px-6 py-4">
            <Label htmlFor="leave-name" className="sr-only">
              Name
            </Label>
            <Input
              id="leave-name"
              placeholder="Name"
              value={newLeaveName}
              onChange={(e) => setNewLeaveName(e.target.value)}
            />
          </div>
          <SheetFooter className="p-6 pt-2">
            <Button
              onClick={handleAddLeave}
              disabled={isSaving || !newLeaveName.trim()}
              className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Leave
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md"
        >
          <SheetHeader className="p-6 pb-2 text-center">
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
            <SheetTitle>Update Leave</SheetTitle>
          </SheetHeader>
          <div className="px-6 py-4">
            <Label htmlFor="update-leave-name">Name</Label>
            <Input
              id="update-leave-name"
              placeholder="Name"
              value={updatedLeaveName}
              onChange={(e) => setUpdatedLeaveName(e.target.value)}
              className="mt-1"
            />
          </div>
          <SheetFooter className="p-6 pt-2">
            <Button
              onClick={handleUpdateLeave}
              disabled={isUpdating || !updatedLeaveName.trim()}
              className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
