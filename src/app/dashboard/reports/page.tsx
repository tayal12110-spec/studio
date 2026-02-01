'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  Wallet,
  FileText as NotesIcon,
  Users,
  Handshake,
  FileSpreadsheet,
  Share2,
  ExternalLink,
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
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type DownloadedReport = {
  name: string;
  month: string;
  branch: string;
};

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
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('reports');
  const [downloads, setDownloads] = useState<DownloadedReport[]>([]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'downloads') {
      setActiveTab('downloads');
      const reportName = searchParams.get('report_name');
      const month = searchParams.get('month');
      const branch = searchParams.get('branch');
      if (reportName && month && branch) {
        const newReport = { name: reportName, month, branch };
        setDownloads(prev => {
            if (prev.some(d => d.name === newReport.name && d.month === newReport.month && d.branch === newReport.branch)) {
                return prev;
            }
            return [newReport, ...prev];
        });
      }
    }
  }, [searchParams]);

  const handleReportClick = (reportName: string) => {
    toast({
      title: 'Generating Report...',
      description: `Generating ${reportName}. This is a demo.`,
    });
  };

  const handleOpenReport = () => {
    toast({
      title: 'Opening Report',
      description: 'This is a demo. The report would open here.',
    });
  };

  const handleShareReport = () => {
    toast({
      title: 'Sharing Report',
      description: 'This is a demo. Sharing functionality would be implemented here.',
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    onClick={() => router.push('/dashboard/reports/detailed-attendance')}
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
          <TabsContent value="downloads" className="p-4">
            {downloads.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground mt-10">
                    No downloads available.
                </div>
            ) : (
                <div className="space-y-4">
                    {downloads.map((report, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <FileSpreadsheet className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{report.name}</p>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{report.month}</span>
                                            <span>{report.branch}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-4">
                                    <Button variant="ghost" className="text-primary hover:text-primary gap-2" onClick={handleOpenReport}>
                                        <ExternalLink className="h-4 w-4" />
                                        Open
                                    </Button>
                                    <Button variant="ghost" className="text-primary hover:text-primary gap-2" onClick={handleShareReport}>
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
