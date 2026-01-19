'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import type { Employee } from './data';
import { DataTableRowActions } from './components/data-table-row-actions';
import { DataTableColumnHeader } from './components/data-table-column-header';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'employeeId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee ID" />
    ),
    cell: ({ row }) => <div>{row.getValue('employeeId')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'department',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue('department')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant: 'outline' | 'secondary' | 'destructive' =
        status === 'Active'
          ? 'outline'
          : status === 'On Leave'
          ? 'secondary'
          : 'destructive';

      return <Badge variant={variant}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'baseSalary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Base Salary" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('baseSalary'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
