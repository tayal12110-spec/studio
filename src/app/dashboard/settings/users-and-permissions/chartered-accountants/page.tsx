'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


type CharteredAccountant = {
  name: string;
  phone: string;
  email: string;
};

export default function CharteredAccountantsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [accountants, setAccountants] = useState<CharteredAccountant[]>([]);
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAddSheet = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCountryCode('+91');
    setIsSheetOpen(true);
  }
  
  const handleAddAccountant = () => {
    if (!name || !phone || !email) {
      toast({
        variant: 'destructive',
        title: 'All fields are required'
      });
      return;
    }

    setIsSaving(true);
    const newAccountant: CharteredAccountant = {
      name,
      phone: `${countryCode} ${phone}`,
      email,
    };
    
    setTimeout(() => {
        setAccountants(prev => [...prev, newAccountant]);
        setIsSaving(false);
        setIsSheetOpen(false);
        toast({
            title: 'Chartered Accountant Added',
            description: `${name} has been added.`
        });
    }, 500);
  };

  const renderContent = () => {
    if (accountants.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">No Chartered Accountants Found</h2>
            <p className="text-muted-foreground">
              You can add multiple chartered accountants
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        {accountants.map((accountant, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg bg-card p-4">
             <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-xl bg-blue-500 text-white">
                    {accountant.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{accountant.name}</p>
                  <p className="text-sm text-muted-foreground">{accountant.phone}</p>
                </div>
              </div>
          </div>
        ))}
      </div>
    );
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
          <h1 className="ml-4 text-lg font-semibold">Add Chartered Accountant</h1>
        </header>

        <main className="flex-1">
          {renderContent()}
        </main>

        <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
          <Button onClick={handleOpenAddSheet} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
            <UserPlus className="mr-2 h-5 w-5" />
            Add Chartered Accountant
          </Button>
        </footer>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
            <SheetHeader className="p-6 pb-2 text-center">
              <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
              <SheetTitle>Add Chartered Accountant</SheetTitle>
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
                    onClick={handleAddAccountant}
                    disabled={isSaving || !name || !phone || !email}
                    className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Add Chartered Accountant'}
                </Button>
            </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
