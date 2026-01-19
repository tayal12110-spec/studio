'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  calculatePayroll,
  type CalculatePayrollOutput,
} from '@/ai/flows/payroll-calculation';
import type { Employee } from '../data';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PayrollDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  employee: Employee;
}

const deductionSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
});

const formSchema = z.object({
  workingDays: z.coerce
    .number()
    .min(0, 'Working days must be a positive number'),
  deductions: z.array(deductionSchema),
});

type PayrollFormValues = z.infer<typeof formSchema>;

export function PayrollDialog({
  isOpen,
  setIsOpen,
  employee,
}: PayrollDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CalculatePayrollOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workingDays: 22,
      deductions: [
        { type: 'Health Insurance', amount: 150 },
        { type: '401k', amount: 300 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'deductions',
  });

  const onSubmit = async (values: PayrollFormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const payrollInput = {
        employeeId: employee.employeeId,
        workingDays: values.workingDays,
        baseSalary: employee.baseSalary,
        deductions: values.deductions,
        otherFactors: { 'tax_rate': 0.15 }
      };

      const payrollResult = await calculatePayroll(payrollInput);
      setResult(payrollResult);
    } catch (error) {
      console.error('Payroll calculation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to calculate payroll. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset form and results after dialog closes
    setTimeout(() => {
      form.reset();
      setResult(null);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>Calculate Payroll</DialogTitle>
          <DialogDescription>
            For {employee.name} ({employee.employeeId})
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          {!result ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="workingDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Days</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Deductions</FormLabel>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`deductions.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Deduction Type" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`deductions.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Amount"
                                {...field}
                                className="w-28"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ type: '', amount: 0 })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Deduction
                  </Button>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Calculate
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Payroll Result</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Gross Salary</p>
                  <p className="text-2xl font-bold">
                    ${result.grossSalary.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg border bg-primary text-primary-foreground p-4">
                  <p className="text-sm text-primary-foreground/80">
                    Net Salary
                  </p>
                  <p className="text-2xl font-bold">
                    ${result.netSalary.toFixed(2)}
                  </p>
                </div>
              </div>

              <h4 className="font-semibold">Breakdown</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.deductionsBreakdown.map((ded, i) => (
                    <TableRow key={i}>
                      <TableCell>{ded.type}</TableCell>
                      <TableCell className="text-right">
                        -${ded.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                   <TableRow>
                      <TableCell>Tax</TableCell>
                      <TableCell className="text-right">
                        -${result.taxAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
              <DialogFooter>
                <Button onClick={handleClose}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
