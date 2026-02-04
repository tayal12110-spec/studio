'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function PfChallanReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [branch, setBranch] = useState('all');
  const [department, setDepartment] = useState('all');
  const [duration, setDuration] = useState<Date | undefined>(new Date(2026, 1)); // Feb 2026
  const [formatType, setFormatType] = useState<'csv' | 'txt'>('csv');

  const handleDownload = () => {
    const reportName = 'PF Challan Report';

    toast({
      title: 'Downloading Report...',
      description: 'Your PF Challan report is being generated.',
    });

    const monthString = duration ? format(duration, 'MMM yyyy') : 'N/A';

    const branchMap: { [key: string]: string } = {
        all: 'All Branches',
        main: 'Main',
        tit: 'tit'
    };
    const branchString = branchMap[branch] || 'All Branches';

    const queryParams = new URLSearchParams({
        tab: 'downloads',
        report_name: reportName,
        month: monthString,
        branch: branchString,
        format: formatType,
    });

    router.push(`/dashboard/reports?${queryParams.toString()}`);
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">PF Challan Report</h1>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div>
          <Label htmlFor="select-branch">Select Branch</Label>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger id="select-branch" className="mt-1">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="main">Main</SelectItem>
              <SelectItem value="tit">tit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="select-department">Select Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="select-department" className="mt-1">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Department</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="select-duration">Select Duration</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="select-duration"
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal mt-1',
                  !duration && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {duration ? format(duration, 'MMM yyyy') : <span>Select month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                onSelect={(date) => date && setDuration(date)}
                initialFocus
                defaultMonth={duration}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
            <Label>Select Format</Label>
            <RadioGroup value={formatType} onValueChange={(value) => setFormatType(value as 'csv' | 'txt')} className="mt-2 grid grid-cols-2 gap-4">
                <Label
                    htmlFor="format-csv"
                    className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3",
                        formatType === 'csv' ? 'border-primary bg-primary/10' : 'border-input'
                    )}
                >
                    <RadioGroupItem value="csv" id="format-csv" className="sr-only" />
                    <FileSpreadsheet className="h-5 w-5 text-green-700" />
                    <span className="font-medium">CSV</span>
                </Label>
                 <Label
                    htmlFor="format-txt"
                    className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3",
                        formatType === 'txt' ? 'border-primary bg-primary/10' : 'border-input'
                    )}
                >
                    <RadioGroupItem value="txt" id="format-txt" className="sr-only" />
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">TXT</span>
                </Label>
            </RadioGroup>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleDownload}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Download Report
        </Button>
      </footer>
    </div>
  );
}
