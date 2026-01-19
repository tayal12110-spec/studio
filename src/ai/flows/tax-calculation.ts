'use server';
/**
 * @fileOverview Automatically calculates employee income tax deductions based on their salary and any other relevant tax rules or declarations.
 *
 * - calculateTaxDeductions - A function that handles the tax deduction calculation process.
 * - TaxCalculationInput - The input type for the calculateTaxDeductions function.
 * - TaxCalculationOutput - The return type for the calculateTaxDeductions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaxCalculationInputSchema = z.object({
  salary: z.number().describe('The employee annual salary.'),
  taxDeclarations: z.string().optional().describe('Any relevant tax declarations made by the employee.'),
  taxRules: z.string().describe('The current tax rules and regulations.'),
});
export type TaxCalculationInput = z.infer<typeof TaxCalculationInputSchema>;

const TaxCalculationOutputSchema = z.object({
  taxDeductions: z.number().describe('The amount of income tax to be deducted from the employee salary.'),
  taxBreakdown: z.string().describe('A detailed breakdown of the tax calculation.'),
});
export type TaxCalculationOutput = z.infer<typeof TaxCalculationOutputSchema>;

export async function calculateTaxDeductions(input: TaxCalculationInput): Promise<TaxCalculationOutput> {
  return calculateTaxDeductionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taxCalculationPrompt',
  input: {schema: TaxCalculationInputSchema},
  output: {schema: TaxCalculationOutputSchema},
  prompt: `You are an expert tax accountant. Your job is to calculate the tax deductions for an employee based on their salary, tax declarations, and the current tax rules.

Salary: {{{salary}}}
Tax Declarations: {{{taxDeclarations}}}
Tax Rules: {{{taxRules}}}

Calculate the income tax deductions based on the above information, and provide a detailed breakdown of the calculation. The output should be in JSON format.

{{ zodFormat=TaxCalculationOutputSchema}}`,
});

const calculateTaxDeductionsFlow = ai.defineFlow(
  {
    name: 'calculateTaxDeductionsFlow',
    inputSchema: TaxCalculationInputSchema,
    outputSchema: TaxCalculationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
