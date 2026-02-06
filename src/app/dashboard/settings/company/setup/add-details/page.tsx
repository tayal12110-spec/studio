'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const allFeatures = [
  'Attendance Tracking',
  'Biometric Device',
  'Payroll',
  'Location Tracking',
  'Salary Payouts',
  'Document Storage',
  'Team Communication',
  'Roster',
];

type FeaturesState = Record<string, boolean>;

export default function AddDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [heardFrom, setHeardFrom] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFeaturesSheetOpen, setIsFeaturesSheetOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<FeaturesState>({});

  const handleContinue = () => {
    if (!name.trim() || !role || !email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Please fill all required fields',
      });
      return;
    }
    setIsSubmitting(true);
    // Simulate saving data
    setTimeout(() => {
      toast({
        title: 'Details Saved!',
      });
      setIsSubmitting(false);
      router.push('/subscription/trial');
    }, 1000);
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [feature]: checked,
    }));
  };

  const selectedFeaturesCount = Object.values(selectedFeatures).filter(Boolean).length;
  const featuresDisplay =
    selectedFeaturesCount > 0
      ? `${selectedFeaturesCount} feature${selectedFeaturesCount > 1 ? 's' : ''} selected`
      : 'Select';

  const isFormValid = name.trim() && role && email.trim();

  return (
    <>
      <div className="flex h-full min-h-screen flex-col bg-background">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <h1 className="text-lg font-semibold">Add your details</h1>
        </header>
        <main className="flex-1 space-y-6 p-6">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="hr-admin">HR/Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="eg. example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="features">Features you are interested in (Optional)</Label>
            <Button
              id="features"
              variant="outline"
              className="w-full justify-start text-left font-normal mt-1"
              onClick={() => setIsFeaturesSheetOpen(true)}
            >
              <span className={selectedFeaturesCount === 0 ? "text-muted-foreground" : ""}>
                {featuresDisplay}
              </span>
            </Button>
          </div>
          <div>
            <Label htmlFor="heard-from">How did you hear about us (Optional)</Label>
            <Select value={heardFrom} onValueChange={setHeardFrom}>
              <SelectTrigger id="heard-from" className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="salary-paid">How much salary do you pay monthly (Optional)</Label>
            <Select value={salary} onValueChange={setSalary}>
              <SelectTrigger id="salary-paid" className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<1L">{'<1 Lakh'}</SelectItem>
                <SelectItem value="1L-3L">1 Lakh to 3 Lakh</SelectItem>
                <SelectItem value=">3L">3 Lakh+</SelectItem>
                <SelectItem value="idk">I don't know</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </main>
        <footer className="sticky bottom-0 border-t bg-card p-4">
          <Button
            onClick={handleContinue}
            disabled={!isFormValid || isSubmitting}
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </footer>
      </div>

      <Sheet open={isFeaturesSheetOpen} onOpenChange={setIsFeaturesSheetOpen}>
        <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
          <SheetHeader className="p-6 pb-2 text-center">
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
            <SheetTitle>Select features you are interested in</SheetTitle>
          </SheetHeader>
          <div className="p-6 space-y-4">
            {allFeatures.map((feature) => (
              <div key={feature} className="flex items-center justify-between">
                <Label htmlFor={feature} className="text-base font-normal">
                  {feature}
                </Label>
                <Checkbox
                  id={feature}
                  checked={!!selectedFeatures[feature]}
                  onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                />
              </div>
            ))}
          </div>
          <SheetFooter className="p-6 pt-2">
            <Button
              onClick={() => setIsFeaturesSheetOpen(false)}
              className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Continue
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
