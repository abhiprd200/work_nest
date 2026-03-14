'use server';
/**
 * @fileOverview This file defines a Genkit flow for triaging user service problems.
 *
 * - triageUserProblem - A function that takes a user's natural language problem description
 *   and returns the most appropriate service professional category.
 * - UserProblemInput - The input type for the triageUserProblem function.
 * - ServiceTriageOutput - The return type for the triageUserProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input schema for the user problem triage flow.
 * @property problemDescription - A natural language description of the user's service problem.
 */
const UserProblemInputSchema = z.object({
  problemDescription: z
    .string()
    .describe("A natural language description of the user's service problem."),
});
export type UserProblemInput = z.infer<typeof UserProblemInputSchema>;

/**
 * Defines the output schema for the service triage flow.
 * @property serviceType - The most appropriate service professional category.
 * @property reasoning - The reasoning behind the chosen service type.
 */
const ServiceTriageOutputSchema = z.object({
  serviceType:
    z.enum([
      'Electrician',
      'Plumber',
      'HVAC Technician',
      'Handyman',
      'Appliance Repair',
      'Locksmith',
      'Pest Control',
      'General Maintenance',
      'Other',
    ])
      .describe('The most appropriate service professional category for the described problem.'),
  reasoning: z.string().describe('The reasoning behind the chosen service type.'),
});
export type ServiceTriageOutput = z.infer<typeof ServiceTriageOutputSchema>;

/**
 * Triages a user's service problem to determine the most appropriate service professional category.
 * @param input - The user's problem description.
 * @returns The recommended service type and the reasoning.
 */
export async function triageUserProblem(input: UserProblemInput): Promise<ServiceTriageOutput> {
  return triageUserProblemFlow(input);
}

/**
 * Defines the prompt for the AI to triage user problems.
 * It instructs the AI to categorize a problem description into a predefined service type.
 */
const problemTriagePrompt = ai.definePrompt({
  name: 'problemTriagePrompt',
  input: {schema: UserProblemInputSchema},
  output: {schema: ServiceTriageOutputSchema},
  prompt: `You are an AI assistant for WorkNest, a platform that connects users with gig workers and emergency service professionals.
Your task is to analyze a user's problem description and identify the most appropriate service professional category from a predefined list.

Here are the available service categories:
- Electrician: For electrical issues like faulty wiring, circuit breakers, power outages, light fixture installation.
- Plumber: For plumbing issues like leaky pipes, clogged drains, water heater problems, toilet repairs.
- HVAC Technician: For heating, ventilation, and air conditioning issues like furnace repair, AC not cooling, thermostat problems.
- Handyman: For general repairs, minor installations, furniture assembly, small odd jobs, or tasks not requiring specialized licensing.
- Appliance Repair: For issues with specific home appliances like refrigerators, ovens, washing machines, dishwashers, microwaves.
- Locksmith: For lock-related problems, lost keys, rekeying, security system installation, broken locks.
- Pest Control: For dealing with insects, rodents, or other pests, including identification and extermination.
- General Maintenance: For routine property upkeep, cleaning, landscaping, non-specific general issues, or preventative tasks not covered by other specialized categories.
- Other: If none of the above categories accurately fit the problem description, select 'Other'.

Analyze the following problem description carefully and determine the best fit among the categories provided.
Provide a concise reasoning for your choice.

Problem Description: {{{problemDescription}}}`,
});

/**
 * Defines the Genkit flow for triaging user service problems.
 * It takes a problem description as input, uses an AI prompt to categorize it,
 * and returns the recommended service type with reasoning.
 */
const triageUserProblemFlow = ai.defineFlow(
  {
    name: 'triageUserProblemFlow',
    inputSchema: UserProblemInputSchema,
    outputSchema: ServiceTriageOutputSchema,
  },
  async (input) => {
    const {output} = await problemTriagePrompt(input);
    if (!output) {
      throw new Error('AI did not return a valid output for problem triage.');
    }
    return output;
  }
);
