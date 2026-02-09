
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
  File as FileIcon,
  Loader2,
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
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

type DownloadedReport = {
  name: string;
  month: string;
  branch: string;
  format: 'pdf' | 'xls' | 'csv' | 'txt';
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
    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
  >
    <div className="flex items-center gap-4">
      <Icon className="h-6 w-6 text-primary" />
      <span className="font-semibold text-lg">{label}</span>
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  </div>
);

function CompanyReportsPageComponent() {
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
      const format = searchParams.get('format') as 'pdf' | 'xls' | 'csv' | 'txt' | null;

      if (reportName && month && branch && format) {
        const newReport: DownloadedReport = { name: reportName, month, branch, format };
        setDownloads(prev => {
            if (prev.some(d => d.name === newReport.name && d.month === newReport.month && d.branch === newReport.branch && d.format === newReport.format)) {
                return prev;
            }
            return [newReport, ...prev];
        });
      }
    }
  }, [searchParams]);

  const handleReportClick = (reportName: string, path?: string) => {
    if (path) {
      router.push(path);
    } else {
      toast({
        title: 'Generating Report...',
        description: `Generating ${reportName}. This is a demo.`,
      });
    }
  };

  const handleOpenReport = (report: DownloadedReport) => {
    const queryParams = new URLSearchParams({
        name: report.name,
        month: report.month,
        branch: report.branch,
    });
    router.push(`/dashboard/reports/detailed-attendance/view?${queryParams.toString()}`);
  };

  const handleShareReport = async (report: DownloadedReport) => {
    const fileName = `${report.name.replace(/\s/g, '_')}.${report.format}`;
    let mimeType = 'application/octet-stream';
    if (report.format === 'pdf') mimeType = 'application/pdf';
    else if (report.format === 'xls') mimeType = 'application/vnd.ms-excel';
    else if (report.format === 'csv') mimeType = 'text/csv';
    else if (report.format === 'txt') mimeType = 'text/plain';

    const fileContent = `This is a dummy file for the report: ${report.name}`;

    try {
      const blob = new Blob([fileContent], { type: mimeType });
      const file = new File([blob], fileName, { type: mimeType });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: report.name,
          text: `Here is the report: ${report.name}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sharing not supported',
          description: 'Your browser does not support sharing files.',
        });
      }
    } catch (error) {
        if ((error as Error).name !== 'AbortError') {
            toast({
              variant: 'destructive',
              title: 'Error Sharing',
              description: 'There was an error trying to share the report.',
            });
        }
    }
  };

  const getFileIcon = (format: DownloadedReport['format']) => {
    switch (format) {
      case 'pdf':
        return <FileIcon className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />;
      case 'xls':
        return <FileSpreadsheet className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />;
      case 'csv':
        return <FileSpreadsheet className="h-8 w-8 text-green-700 mt-1 flex-shrink-0" />;
      case 'txt':
          return <NotesIcon className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />;
      default:
        return <FileIcon className="h-8 w-8 text-gray-500 mt-1 flex-shrink-0" />;
    }
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
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="item-1">
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
                    onClick={() => router.push('/dashboard/reports/daily-attendance')}
                  />
                  <ReportRow
                    label="Company Roster Report"
                    onClick={() => router.push('/dashboard/reports/company-roster')}
                  />
                  <ReportRow
                    label="Late Arrival Report"
                    onClick={() => router.push('/dashboard/reports/late-arrival')}
                  />
                  <ReportRow
                    label="Leave Report"
                    onClick={() => router.push('/dashboard/reports/leave-report')}
                  />
                  <ReportRow
                    label="Overtime Report"
                    onClick={() => router.push('/dashboard/reports/overtime-report')}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="p-4 hover:no-underline text-lg font-semibold">
                  <div className="flex items-center gap-4">
                    <Wallet className="h-6 w-6 text-primary" />
                    <span>Payroll</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <ReportRow label="Pay Slips" onClick={() => handleReportClick('Pay Slips', '/dashboard/reports/payslips')} />
                  <ReportRow label="Salary Sheet" onClick={() => handleReportClick('Salary Sheet', '/dashboard/reports/salary-sheet')} />
                  <ReportRow label="CTC Breakdown Report" onClick={() => handleReportClick('CTC Breakdown Report', '/dashboard/reports/ctc-breakdown')} />
                  <ReportRow label="Incentive Sheet" onClick={() => handleReportClick('Incentive Sheet', '/dashboard/reports/incentive-sheet')} />
                  <ReportRow label="Reimbursement Report" onClick={() => handleReportClick('Reimbursement Report', '/dashboard/reports/reimbursement-report')} />
                  <ReportRow label="Provident Fund Challan Report" onClick={() => handleReportClick('Provident Fund Challan Report', '/dashboard/reports/pf-challan')} />
                  <ReportRow label="ESI Report" onClick={() => handleReportClick('ESI Report', '/dashboard/reports/esi-report')} />
                  <ReportRow label="ESI Challan Report" onClick={() => router.push('/dashboard/reports/esi-challan')} />
                  <ReportRow label="Loan Report" onClick={() => handleReportClick('Loan Report', '/dashboard/reports/loan-report')} />
                  <ReportRow label="TDS Summary Report" onClick={() => handleReportClick('TDS Summary Report', '/dashboard/reports/tds-summary')} />
                </AccordionContent>
              </AccordionItem>
              <div className="border-b">
                <ReportCategoryRow
                    icon={NotesIcon}
                    label="Notes"
                    onClick={() => handleReportClick('Notes Report', '/dashboard/reports/notes')}
                />
              </div>
              <div className="border-b">
                <ReportCategoryRow
                    icon={Users}
                    label="Employee List"
                    onClick={() => router.push('/dashboard/reports/employee-list')}
                />
              </div>
              <AccordionItem value="item-5">
                <AccordionTrigger className="p-4 hover:no-underline text-lg font-semibold">
                  <div className="flex items-center gap-4">
                    <Handshake className="h-6 w-6 text-primary" />
                    <span>CRM</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <ReportRow
                    label="Meeting Detailed Report"
                    onClick={() => router.push('/dashboard/reports/meeting-detailed')}
                  />
                  <ReportRow
                    label="Meeting Summary Report"
                    onClick={() => router.push('/dashboard/reports/meeting-summary')}
                  />
                  <ReportRow
                    label="Trip Detailed Report"
                    onClick={() => router.push('/dashboard/reports/trip-detailed')}
                  />
                  <ReportRow
                    label="Trip Summary Report"
                    onClick={() => router.push('/dashboard/reports/trip-summary')}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                                    {getFileIcon(report.format)}
                                    <div className="flex-grow">
                                        <p className="font-semibold">{report.name}</p>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{report.month}</span>
                                            <span>{report.branch}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-4">
                                    <Button variant="ghost" className="text-primary hover:text-primary gap-2" onClick={() => handleOpenReport(report)}>
                                        <ExternalLink className="h-4 w-4" />
                                        Open
                                    </Button>
                                    <Button variant="ghost" className="text-primary hover:text-primary gap-2" onClick={() => handleShareReport(report)}>
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

export default function CompanyReportsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CompanyReportsPageComponent />
        </Suspense>
    )
}
