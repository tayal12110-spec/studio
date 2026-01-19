'use server';
/**
 * @fileOverview Payroll calculation AI agent based on configurable rules.
 *
 * - calculatePayroll - A function that calculates the payroll.
 * - CalculatePayrollInput - The input type for the calculatePayroll function.
 * - CalculatePayrollOutput - The return type for the calculatePayroll function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculatePayrollInputSchema = z.object({
  employeeId: z.string().describe('The ID of the employee.'),
  workingDays: z.number().describe('Number of days the employee worked.'),
  baseSalary: z.number().describe('The base salary of the employee.'),
  deductions: z
    .array(z.object({type: z.string(), amount: z.number()}))
    .describe('A list of deductions to apply to the payroll.'),
  otherFactors: z.record(z.string(), z.number()).optional().describe('Other factors that might affect the payroll calculation.'),
});
export type CalculatePayrollInput = z.infer<typeof CalculatePayrollInputSchema>;

const CalculatePayrollOutputSchema = z.object({
  grossSalary: z.number().describe('The gross salary before deductions.'),
  netSalary: z.number().describe('The net salary after deductions.'),
  deductionsBreakdown: z
    .array(z.object({type: z.string(), amount: z.number()}))
    .describe('A detailed breakdown of all deductions.'),
  taxAmount: z.number().describe('The amount of tax deducted.'),
});
export type CalculatePayrollOutput = z.infer<typeof CalculatePayrollOutputSchema>;

export async function calculatePayroll(input: CalculatePayrollInput): Promise<CalculatePayrollOutput> {
  return calculatePayrollFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculatePayrollPrompt',
  input: {schema: CalculatePayrollInputSchema},
  output: {schema: CalculatePayrollOutputSchema},
  prompt: `You are a payroll expert. Calculate the payroll for employee ID {{{employeeId}}}.\
      The employee worked for {{{workingDays}}} days and has a base salary of {{{baseSalary}}}.\
      Apply the following deductions:\
      {{#each deductions}}\
        - Type: {{{type}}}, Amount: {{{amount}}}\
      {{/each}}\
      Here are some other factors that might affect the payroll calculation: {{#each otherFactors}}{{{@key}}}: {{{this}}} {{/each}}.\
      Calculate the gross salary, net salary, a detailed breakdown of all deductions, and the tax amount.
\
      Ensure the response is a valid JSON object.`,
});

const calculatePayrollFlow = ai.defineFlow(
  {
    name: 'calculatePayrollFlow',
    inputSchema: CalculatePayrollInputSchema,
    outputSchema: CalculatePayrollOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
