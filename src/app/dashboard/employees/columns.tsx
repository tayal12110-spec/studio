'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import type { Employee } from '../data';
import { DataTableRowActions } from './components/data-table-row-actions';
import { DataTableColumnHeader } from './components/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Employee>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'employeeId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('employeeId')}</div>,
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
      const variant: 'default' | 'secondary' | 'destructive' =
        status === 'Active'
          ? 'default'
          : status === 'On Leave'
          ? 'secondary'
          : 'destructive';

      const statusClass = status === 'Active' ? 'bg-green-100 text-green-800' : 
                           status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-red-100 text-red-800';

      return <Badge className={statusClass} variant={variant}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'baseSalary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Base Salary" className="justify-end" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('baseSalary'));
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
