'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MoreVertical, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

const ReportViewContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const month = searchParams.get('month') || 'February 2026';
    const branch = searchParams.get('branch') || 'tut';
    const reportDate = '01-02-2026';

    const employee = {
        name: 'tinku',
        phone: '+91 9811021904',
        branch: 'tut',
        department: '-',
        employeeId: '-',
        designation: '-',
        schedule: '-',
        scheduledHours: '-'
    };

    const attendanceSummary = {
        payable: 1.0,
        present: 0,
        absent: 0,
        halfDays: 0,
        doublePresent: 0,
        weekOff: 0,
        paidLeaves: 0,
        unpaidLeaves: 0,
        publicHoliday: 1
    };
    
    const HeaderCell = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <th className={`p-2 text-left font-semibold text-xs ${className}`}>
            {children}
        </th>
    );

    const DataCell = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <td className={`p-2 text-xs ${className}`}>
            {children}
        </td>
    );


    return (
        <div className="flex h-full min-h-screen flex-col bg-white dark:bg-black">
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Go back"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">Report</h1>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </header>

            <main className="flex-1 overflow-y-auto bg-white p-4 text-black dark:bg-black dark:text-white">
                <div className="mx-auto max-w-4xl">
                    <div className="text-center">
                        <p className="font-semibold">{branch}</p>
                        <h2 className="text-sm font-bold my-1">
                            ATTENDANCE REPORT FOR THE MONTH of {month}
                        </h2>
                    </div>

                    <div className="flex justify-end text-xs text-right mt-4">
                        <div>
                            <p>Report Date: {reportDate}</p>
                            <p>Address: -</p>
                            <p>Gstin: -</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Employee Details</h3>
                        <div className="overflow-x-auto border">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        {['Name', 'Phone Number', 'Branch', 'Department', 'Employee Id', 'Designation', 'Schedule', 'Scheduled Working Hours'].map(h => <HeaderCell key={h}>{h}</HeaderCell>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <DataCell>{employee.name}</DataCell>
                                        <DataCell>{employee.phone}</DataCell>
                                        <DataCell>{employee.branch}</DataCell>
                                        <DataCell>{employee.department}</DataCell>
                                        <DataCell>{employee.employeeId}</DataCell>
                                        <DataCell>{employee.designation}</DataCell>
                                        <DataCell>{employee.schedule}</DataCell>
                                        <DataCell>{employee.scheduledHours}</DataCell>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Attendance summary</h3>
                        <div className="overflow-x-auto border">
                             <table className="w-full text-center">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                       {['Payable Days', 'Present', 'Absent', 'Half Days', 'Double Present', 'Week Off', 'Paid Leaves', 'Unpaid Leaves', 'Public Holiday'].map(h => <HeaderCell key={h} className="text-center">{h}</HeaderCell>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <DataCell className="text-center">{attendanceSummary.payable}</DataCell>
                                        <DataCell className="text-center">{attendanceSummary.present}</DataCell>
                                        <DataCell className="text-center">{attendanceSummary.absent}</DataCell>
                                        <DataCell className="text-center">{attendanceSummary.halfDays}</DataCell>
                                        <DataCell className="text-center">{attendanceSummary.doublePresent}</DataCell>
                                        <DataCell className="text-center">{attendanceSummary.weekOff}</DataCell>
                                        <DataCell className="text-center">{attendanceSummary.paidLeaves}</DataCell>
                                        <DataCell className="text-center">{attendanceSummary.unpaidLeaves}</DataCell>
                                        <DataCell className="text-center">{attendanceSummary.publicHoliday}</DataCell>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 border">
                         <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <HeaderCell className="w-1/2">Date</HeaderCell>
                                    <HeaderCell className="w-1/2 text-right">Feb 01</HeaderCell>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t"><DataCell>Day</DataCell><DataCell className="text-right">PH</DataCell></tr>
                                <tr className="border-t"><DataCell>Status</DataCell><DataCell className="text-right">-</DataCell></tr>
                                <tr className="border-t"><DataCell>Punch Timings</DataCell><DataCell className="text-right">In -<br/>Out -</DataCell></tr>
                                <tr className="border-t"><DataCell>Hrs Worked Total:</DataCell><DataCell className="text-right">-</DataCell></tr>
                                <tr className="border-t"><DataCell>Late Hrs Total:</DataCell><DataCell className="text-right">-</DataCell></tr>
                                <tr className="border-t"><DataCell>Early Hrs Total:</DataCell><DataCell className="text-right">-</DataCell></tr>
                                <tr className="border-t"><DataCell>Overtime Hrs Total:</DataCell><DataCell className="text-right">-</DataCell></tr>
                            </tbody>
                         </table>
                    </div>
                    
                    <div className="mt-4 p-2 border text-xs text-muted-foreground">
                        <p><strong>Note:</strong> Present: P, Absent: A, Paid leave: PL, Unpaid leave: UPL, Half Day: HD, Week off: WO, Public holiday: PH, Half-day paid leave: HD/PL, Double present: 2P</p>
                    </div>

                    <div className="mt-8 flex justify-between items-center text-xs">
                         <div className="p-2 border">SalaryBox Logo</div>
                         <p>Download the App now to check your attendance</p>
                    </div>

                </div>
            </main>
            <footer className="sticky bottom-0 border-t bg-card p-4">
                <Button className="w-full h-12 text-base bg-cyan-400 text-black hover:bg-cyan-500">
                    <Share2 className="mr-2 h-5 w-5" />
                    Share Report
                </Button>
            </footer>
        </div>
    );
};

// A wrapper component to handle the suspense boundary for useSearchParams
export default function ReportViewPage() {
    return (
        <Suspense fallback={<div>Loading report...</div>}>
            <ReportViewContent />
        </Suspense>
    );
}
