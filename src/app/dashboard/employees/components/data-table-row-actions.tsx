'use client';

import { MoreHorizontal } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Employee } from '../data';
import { useState } from 'react';
import { PayrollDialog } from './payroll-dialog';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const employee = row.original as Employee;
  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPayrollDialogOpen(true)}>
            Calculate Payroll
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PayrollDialog
        isOpen={isPayrollDialogOpen}
        setIsOpen={setIsPayrollDialogOpen}
        employee={employee}
      />
    </>
  );
}
