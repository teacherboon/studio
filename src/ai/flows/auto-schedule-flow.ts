'use server';

/**
 * @fileOverview Automatically generates a class schedule based on offerings and constraints.
 *
 * - autoSchedule - A function that attempts to schedule all offerings.
 * - AutoScheduleInput - The input type for the autoSchedule function.
 * - AutoScheduleOutput - The return type for the autoSchedule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OfferingSchema = z.object({
    offeringId: z.string(),
    subjectId: z.string(),
    classId: z.string(),
    teacherEmail: z.string(),
    periodsPerWeek: z.number().optional(),
});

const ScheduleSchema = z.object({
    scheduleId: z.string(),
    offeringId: z.string(),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']),
    period: z.number(),
});

export const AutoScheduleInputSchema = z.object({
  offerings: z.array(OfferingSchema).describe('List of all course offerings for the semester.'),
  existingSchedules: z.array(ScheduleSchema).describe('List of schedules that are already fixed.'),
  teachers: z.array(z.object({ email: z.string(), name: z.string() })).describe('List of all teachers.'),
  classes: z.array(z.object({ classId: z.string(), name: z.string() })).describe('List of all classes.'),
  periods: z.array(z.number()).describe('List of available period numbers, e.g., [1, 2, 3, 4, 5, 6].'),
  days: z.array(z.string()).describe('List of available days, e.g., ["MONDAY", "TUESDAY", ...].')
});

export type AutoScheduleInput = z.infer<typeof AutoScheduleInputSchema>;

const FailedScheduleSchema = z.object({
  offeringId: z.string(),
  reason: z.string().describe('The reason why this offering could not be scheduled.'),
});

export const AutoScheduleOutputSchema = z.object({
  newSchedules: z.array(ScheduleSchema).describe('A list of newly created schedule entries.'),
  failedSchedules: z.array(FailedScheduleSchema).describe('A list of offerings that could not be fully scheduled, along with the reason.'),
});

export type AutoScheduleOutput = z.infer<typeof AutoScheduleOutputSchema>;

export async function autoSchedule(input: AutoScheduleInput): Promise<AutoScheduleOutput> {
  return autoScheduleFlow(input);
}

const prompt = ai.definePrompt({
    name: 'autoSchedulePrompt',
    input: { schema: AutoScheduleInputSchema },
    output: { schema: AutoScheduleOutputSchema },
    prompt: `You are an expert AI school scheduler. Your task is to automatically create a weekly class schedule.

**Objective:**
Assign a day and period for all required course offerings, respecting all constraints.

**Constraints:**
1.  A teacher cannot teach two different classes at the same time.
2.  A class cannot attend two different subjects at the same time.
3.  The number of scheduled periods per week for an offering must match its 'periodsPerWeek' property.
4.  Do not schedule classes during periods that are not in the provided 'periods' list.
5.  Only use the days provided in the 'days' list.
6.  Do not alter or remove 'existingSchedules'.

**Input Data:**
-   **Offerings to Schedule:** A list of courses, each with a required number of periods per week, a teacher, and a class.
-   **Existing Schedules:** A list of classes that are already on the schedule and cannot be moved.
-   **Teachers:** A list of all teachers.
-   **Classes:** A list of all classes.
-   **Periods:** A list of valid teaching periods in a day (e.g., [1, 2, 3, 4, 5, 6]).
-   **Days:** A list of valid school days (e.g., ['MONDAY', 'TUESDAY', ...]).

**Process:**
1.  Determine how many periods need to be scheduled for each offering by comparing 'periodsPerWeek' with the 'existingSchedules'.
2.  For each period that needs scheduling, find an available time slot (a day and period combination).
3.  A time slot is available for an offering if BOTH the assigned teacher AND the assigned class are free at that time.
4.  Iterate through all available days and periods to find a suitable slot. You can place the class in any valid, available slot. There is no need for complex optimization; any valid placement is acceptable.
5.  Create a new schedule entry for each successfully placed period. The 'scheduleId' for new entries should be a unique string, like 'auto-sch-1', 'auto-sch-2', etc.
6.  If an offering cannot be fully scheduled (i.e., you cannot find enough available slots), add it to the 'failedSchedules' list with a clear reason (e.g., "Teacher 'Teacher Name' has no available slots" or "Class 'Class Name' has no available slots").

**Output:**
Return a JSON object containing two lists:
-   'newSchedules': All the schedule entries you successfully created.
-   'failedSchedules': All the offerings you could not fully schedule, with the reason for failure.
`,
});

const autoScheduleFlow = ai.defineFlow(
  {
    name: 'autoScheduleFlow',
    inputSchema: AutoScheduleInputSchema,
    outputSchema: AutoScheduleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
