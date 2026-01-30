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


export default function AdminsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [admins, setAdmins] = useState([
    {
      name: 'cg',
      phone: '+91 9717471142',
      isOwner: true,
      email: 'cg@example.com' // I'll assume an email exists for consistency
    },
  ]);
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddAdmin = () => {
    if (!name || !phone || !email) {
      toast({
        variant: 'destructive',
        title: 'All fields are required'
      });
      return;
    }

    setIsSaving(true);
    const newAdmin = {
      name,
      phone: `${countryCode} ${phone}`,
      email,
      isOwner: false,
    };
    
    // In a real app, this would be an API call.
    setTimeout(() => {
        setAdmins(prev => [...prev, newAdmin]);
        setIsSaving(false);
        setIsSheetOpen(false);
        // Reset form
        setName('');
        setPhone('');
        setEmail('');
        toast({
            title: 'Admin Added',
            description: `${name} has been added as an admin.`
        });
    }, 500);
  };

  const openSheet = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCountryCode('+91');
    setIsSheetOpen(true);
  }

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
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </main>

        <div className="fixed bottom-24 right-6 z-10 md:bottom-6">
          <Button onClick={openSheet} className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90">
            <Plus className="mr-2 h-5 w-5" />
            Add Admin
          </Button>
        </div>
      </div>
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
            <SheetHeader className="p-6 pb-2 text-center">
              <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
              <SheetTitle className="text-xl font-semibold">Add Admin</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-6 py-2">
                <div>
                    <Label htmlFor="name" className="sr-only">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                </div>
                <div>
                    <Label className="sr-only">Phone Number</Label>
                    <div className="flex items-center gap-2">
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
                    <Label htmlFor="email" className="sr-only">Email Id</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Id" />
                </div>
            </div>
            <SheetFooter className="p-6 pt-4">
                <Button
                    onClick={handleAddAdmin}
                    disabled={isSaving || !name || !phone || !email}
                    className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Add Admin'}
                </Button>
            </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
