'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmployees } from '@/app/dashboard/employee-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Employee } from '@/app/dashboard/data';

export default function VerificationStaffListPage() {
  const router = useRouter();
  const { employees, isLoading } = useEmployees();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (employees.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          <p>No staff found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <p className="px-4 py-2 text-sm text-muted-foreground">Showing {filteredEmployees.length} staff</p>
        {filteredEmployees.map((employee) => (
          <Link
            key={employee.id}
            href={`/dashboard/employees/${employee.id}/background-verification`}
            className="flex items-center justify-between bg-card p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{employee.avatar || employee.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{employee.name}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Not Started</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
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
        <h1 className="ml-4 text-lg font-semibold">Verification Staff List</h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search staff by name"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
