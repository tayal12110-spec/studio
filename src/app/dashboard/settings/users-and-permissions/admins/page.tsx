'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Plus, Star, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Admin = {
  name: string;
  phone: string;
  isOwner: boolean;
  email: string;
};

export default function AdminsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [admins, setAdmins] = useState<Admin[]>([
    {
      name: 'cg',
      phone: '+91 9717471142',
      isOwner: true,
      email: 'cg@example.com'
    },
  ]);
  
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [editingAdminIndex, setEditingAdminIndex] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAddSheet = () => {
    setSheetMode('add');
    setEditingAdminIndex(null);
    setName('');
    setPhone('');
    setEmail('');
    setCountryCode('+91');
    setIsFormSheetOpen(true);
  }

  const handleOpenEditSheet = (admin: Admin, index: number) => {
    setSheetMode('edit');
    setEditingAdminIndex(index);
    
    setName(admin.name);
    setEmail(admin.email);
    
    const phoneParts = admin.phone.split(' ');
    if (phoneParts.length > 1 && phoneParts[0].startsWith('+')) {
      setCountryCode(phoneParts[0]);
      setPhone(phoneParts.slice(1).join(' '));
    } else {
      setCountryCode('+91');
      setPhone(admin.phone);
    }
    
    setIsFormSheetOpen(true);
  };
  
  const handleFormSubmit = () => {
    if (!name || !phone || !email) {
      toast({
        variant: 'destructive',
        title: 'All fields are required'
      });
      return;
    }

    if (sheetMode === 'add') {
      handleAddAdmin();
    } else {
      handleSaveEdit();
    }
  };

  const handleAddAdmin = () => {
    setIsSaving(true);
    const newAdmin: Admin = {
      name,
      phone: `${countryCode} ${phone}`,
      email,
      isOwner: false,
    };
    
    setTimeout(() => {
        setAdmins(prev => [...prev, newAdmin]);
        setIsSaving(false);
        setIsFormSheetOpen(false);
        toast({
            title: 'Admin Added',
            description: `${name} has been added as an admin.`
        });
    }, 500);
  };
  
  const handleSaveEdit = () => {
    if (editingAdminIndex === null) return;
    
    setIsSaving(true);
    
    setTimeout(() => {
        const updatedAdmins = [...admins];
        const originalAdmin = updatedAdmins[editingAdminIndex];
        if (originalAdmin) {
            updatedAdmins[editingAdminIndex] = {
                ...originalAdmin,
                name,
                phone: `${countryCode} ${phone}`,
                email,
            };
        }
        setAdmins(updatedAdmins);
        setIsSaving(false);
        setIsFormSheetOpen(false);
        toast({ title: 'Admin Updated', description: `${name}'s details have been updated.` });
    }, 500);
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
          <h1 className="ml-4 text-lg font-semibold">Add Admins</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {admins.map((admin, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-card p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-xl bg-red-500 text-white">
                      {admin.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {admin.isOwner && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400">
                      <Star className="h-3 w-3 fill-white text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{admin.name}</p>
                  <p className="text-sm text-muted-foreground">{admin.phone}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenEditSheet(admin, index)}>
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </main>

        <div className="fixed bottom-24 right-6 z-10 md:bottom-6">
          <Button onClick={handleOpenAddSheet} className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90">
            <Plus className="mr-2 h-5 w-5" />
            Add Admin
          </Button>
        </div>
      </div>
      
      <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
        <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
            <SheetHeader className="p-6 pb-2 text-center">
              <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
              <SheetTitle>{sheetMode === 'add' ? 'Add Admin' : 'Edit Admin'}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-6 py-2">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mt-1" />
                </div>
                <div>
                    <Label>Phone Number</Label>
                    <div className="flex items-center gap-2 mt-1">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                            <SelectTrigger className="w-[85px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+91">+91</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="flex-1" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="email">Email Id</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Id" className="mt-1" />
                </div>
            </div>
            <SheetFooter className="p-6 pt-4">
                <Button
                    onClick={handleFormSubmit}
                    disabled={isSaving || !name || !phone || !email}
                    className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (sheetMode === 'add' ? 'Add Admin' : 'Save')}
                </Button>
            </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
