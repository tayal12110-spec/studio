'use client';

import { useState } from 'react';
import { useRouter }from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, FileSpreadsheet } from 'lucide-react';
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

export default function MeetingSummaryReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [branch, setBranch] = useState('all');
  const [department, setDepartment] = useState('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(2026, 1, 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2026, 1, 5));
  const [formatType, setFormatType] = useState<'xls'>('xls');

  const handleDownload = () => {
    const reportName = "Meeting Summary Report";

    toast({
      title: 'Downloading Report...',
      description: 'Your meeting summary report is being generated.',
    });

    const fromDateStr = fromDate ? format(fromDate, 'dd MMM yyyy') : 'N/A';
    const toDateStr = toDate ? format(toDate, 'dd MMM yyyy') : 'N/A';
    const dateString = `${fromDateStr} - ${toDateStr}`;

    const branchMap: { [key: string]: string } = {
        all: 'All Branches',
        main: 'Main',
        tit: 'tit'
    };
    const branchString = branchMap[branch] || 'All Branches';

    const queryParams = new URLSearchParams({
        tab: 'downloads',
        report_name: reportName,
        month: dateString, // Re-using month param for date range
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
        <h1 className="ml-4 text-lg font-semibold">Meeting Summary Report</h1>
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

        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="from-date">From Date *</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="from-date"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !fromDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "d MMM yyyy") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        disabled={(date) =>
                           (toDate && date > toDate) || date < new Date("1900-01-01")
                        }
                    />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Label htmlFor="to-date">To Date *</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="to-date"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !toDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "d MMM yyyy") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                        initialFocus
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        disabled={(date) =>
                           (fromDate && date < fromDate) || date < new Date("1900-01-01")
                        }
                    />
                    </PopoverContent>
                </Popover>
            </div>
        </div>

        <div>
            <Label>Select Format</Label>
            <RadioGroup value={formatType} onValueChange={(value) => setFormatType(value as 'xls')} className="mt-2">
                <div className="rounded-lg border has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <Label htmlFor="format-xls" className="flex cursor-pointer items-center gap-3 p-3">
                    <RadioGroupItem value="xls" id="format-xls" />
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <span className="font-medium">XLS</span>
                </Label>
              </div>
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
