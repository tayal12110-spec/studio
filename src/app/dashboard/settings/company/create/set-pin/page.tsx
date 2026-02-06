'use client';

import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const PinInput = ({
  length,
  onChange,
  className,
}: {
  length: number;
  onChange: (pin: string) => void;
  className?: string;
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    onChange(newValues.join(''));

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={cn('flex justify-center gap-2 md:gap-4', className)}>
      {values.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="password"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="h-14 w-12 border-0 border-b-2 border-gray-300 bg-transparent p-0 rounded-none text-center text-4xl focus:ring-0 focus:border-accent dark:border-gray-600 dark:focus:border-accent"
          style={{ caretColor: 'transparent' }}
        />
      ))}
    </div>
  );
};

export default function SetPinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSetting, setIsSetting] = useState(false);

  const handleSetPin = () => {
    if (pin.length !== 4 || pin !== confirmPin) {
      toast({
        variant: 'destructive',
        title: 'PINs do not match',
        description: 'Please ensure both PINs are the same.',
      });
      return;
    }
    
    setIsSetting(true);
    // Simulate saving PIN
    setTimeout(() => {
        setIsSetting(false);
        toast({
            title: 'PIN Set Successfully!',
        });
        router.push('/welcome');
    }, 1000);
  };

  const isFormValid = pin.length === 4 && confirmPin.length === 4 && pin === confirmPin;

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-16">
            <div className="space-y-4">
                <h1 className="text-xl text-left font-medium">Set 4 digit login PIN</h1>
                <PinInput length={4} onChange={setPin} />
            </div>
            <div className="space-y-4">
                <h1 className="text-xl text-left font-medium">Confirm login PIN</h1>
                <PinInput length={4} onChange={setConfirmPin} />
            </div>
        </div>
      </main>
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleSetPin}
          disabled={!isFormValid || isSetting}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isSetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Set PIN
        </Button>
      </footer>
    </div>
  );
}
