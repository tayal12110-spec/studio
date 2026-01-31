'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  Wallet,
  FileText as NotesIcon,
  Users,
  Handshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const ReportRow = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 border-t"
  >
    <span className="font-medium">{label}</span>
  </div>
);

const ReportCategoryRow = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 border-b"
  >
    <div className="flex items-center gap-4">
      <Icon className="h-6 w-6 text-primary" />
      <span className="font-semibold text-lg">{label}</span>
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  </div>
);

export default function CompanyReportsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleReportClick = (reportName: string) => {
    toast({
      title: 'Generating Report...',
      description: `Generating ${reportName}. This is a demo.`,
    });
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
        <h1 className="ml-4 text-lg font-semibold">Company Reports</h1>
      </header>
      <main className="flex-1">
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none h-auto p-0 bg-card border-b">
            <TabsTrigger
              value="reports"
              className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              REPORTS
            </TabsTrigger>
            <TabsTrigger
              value="downloads"
              className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              DOWNLOADS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reports" className="m-0">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" className="border-b">
                <AccordionTrigger className="p-4 hover:no-underline text-lg font-semibold">
                  <div className="flex items-center gap-4">
                    <ClipboardList className="h-6 w-6 text-primary" />
                    <span>Attendance</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <ReportRow
                    label="Attendance Summary Report"
                    onClick={() => router.push('/dashboard/reports/attendance-summary')}
                  />
                  <ReportRow
                    label="Detailed Attendance Report"
                    onClick={() => handleReportClick('Detailed Attendance Report')}
                  />
                  <ReportRow
                    label="Daily Attendance Report"
                    onClick={() => handleReportClick('Daily Attendance Report')}
                  />
                  <ReportRow
                    label="Company Roster Report"
                    onClick={() => handleReportClick('Company Roster Report')}
                  />
                  <ReportRow
                    label="Late Arrival Report"
                    onClick={() => handleReportClick('Late Arrival Report')}
                  />
                  <ReportRow
                    label="Leave Report"
                    onClick={() => handleReportClick('Leave Report')}
                  />
                  <ReportRow
                    label="Overtime Report"
                    onClick={() => handleReportClick('Overtime Report')}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <ReportCategoryRow
              icon={Wallet}
              label="Payroll"
              onClick={() => handleReportClick('Payroll Report')}
            />
             <ReportCategoryRow
              icon={NotesIcon}
              label="Notes"
              onClick={() => handleReportClick('Notes Report')}
            />
             <ReportCategoryRow
              icon={Users}
              label="Employee List"
              onClick={() => handleReportClick('Employee List Report')}
            />
             <ReportCategoryRow
              icon={Handshake}
              label="CRM"
              onClick={() => handleReportClick('CRM Report')}
            />
          </TabsContent>
          <TabsContent value="downloads" className="p-4 text-center text-muted-foreground mt-10">
            No downloads available.
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
