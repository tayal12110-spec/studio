'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Download } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const chartData = [
  { department: 'Engineering', budget: 27500, fill: 'var(--color-engineering)' },
  { department: 'Marketing', budget: 15000, fill: 'var(--color-marketing)' },
  { department: 'Sales', budget: 12500, fill: 'var(--color-sales)' },
  { department: 'HR', budget: 5000, fill: 'var(--color-hr)' },
];

const chartConfig = {
  budget: {
    label: 'Budget',
  },
  engineering: {
    label: 'Engineering',
    color: 'hsl(var(--chart-1))',
  },
  marketing: {
    label: 'Marketing',
    color: 'hsl(var(--chart-2))',
  },
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-3))',
  },
  hr: {
    label: 'HR',
    color: 'hsl(var(--chart-4))',
  },
};

const reportData = [
    { employeeId: 'E-12345', name: 'Alice Johnson', department: 'Engineering', netSalary: 5800.50, payDate: '2024-06-30' },
    { employeeId: 'E-12346', name: 'Bob Williams', department: 'HR', netSalary: 4200.00, payDate: '2024-06-30' },
    { employeeId: 'E-12348', name: 'Diana Prince', department: 'Sales', netSalary: 5500.75, payDate: '2024-06-30' },
];

function downloadCSV(data: any[], filename: string) {
    if (data.length === 0) {
        return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export default function ReportsPage() {
  const { toast } = useToast();

  const handleDownload = () => {
    downloadCSV(reportData, 'payroll_report_june_2024.csv');
    toast({
        title: 'Download Started',
        description: 'Your payroll report is being downloaded.',
    });
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Reports">
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </DashboardHeader>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                Department Budget Allocation
              </CardTitle>
              <CardDescription>
                Monthly payroll budget distribution by department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[300px]"
              >
                <ResponsiveContainer>
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="budget"
                      nameKey="department"
                      innerRadius={60}
                      strokeWidth={5}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
