'use server';

/**
 * @fileOverview Automatically generates a class schedule based on offerings and constraints.
 *
 * - autoSchedule - A function that attempts to schedule all offerings.
 * - AutoScheduleInput - The input type for the autoSchedule function.
 * - AutoScheduleOutput - The return type for the autoSchedule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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

const AutoScheduleInputSchema = z.object({
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

const AutoScheduleOutputSchema = z.object({
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
    prompt: `You are an expert AI school scheduler. Your task is to automatically create a weekly class schedule by placing remaining classes into available slots.

**Objective:**
Assign a day and period for all required course offerings that have not yet been scheduled, respecting all constraints.

**Core Constraints (MUST be followed):**
1.  **Teacher Conflict:** A teacher cannot teach two different classes at the same time.
2.  **Class Conflict:** A class cannot attend two different subjects at the same time.
3.  The total number of scheduled periods per week for an offering must match its 'periodsPerWeek' property.
4.  Only use the days and periods provided in the input lists.
5.  Do not alter or remove 'existingSchedules'.

**Input Data:**
-   **Offerings to Schedule:** A list of courses that need to be placed on the schedule.
-   **Existing Schedules:** A list of classes that are already fixed and cannot be moved. This represents the current state of the schedule.
-   **Teachers & Classes:** Lists of all available teachers and classes.
-   **Periods & Days:** Lists of valid teaching periods and days.

**Execution Algorithm:**
1.  **Build Availability Maps:**
    *   First, create two availability maps in your memory: one for teachers ('teacherAvailability') and one for classes ('classAvailability').
    *   Iterate through all 'existingSchedules'. For each schedule entry, mark the corresponding time slot (e.g., "MONDAY-1") as "busy" for both the teacher of that offering and the class of that offering in your maps.

2.  **Iterative Placement:**
    *   Iterate through each 'offering' in the 'offerings' input list.
    *   For each offering, determine the number of periods that still need to be scheduled by subtracting the count in 'existingSchedules' from 'periodsPerWeek'.
    *   For each period that needs a slot, iterate through all possible time slots (all 'days' and all 'periods').
    *   For each potential time slot (e.g., TUESDAY-3), check **BOTH** availability maps:
        *   Is the teacher for this offering available at this time?
        *   Is the class for this offering available at this time?
    *   **If BOTH are available:**
        *   Place the class. Create a new schedule entry. The 'scheduleId' should be a unique string (e.g., 'auto-sch-1', 'auto-sch-2').
        *   **Crucially, update your availability maps immediately.** Mark this time slot as "busy" for both the teacher and the class to prevent conflicts in subsequent placements.
        *   Move on to the next required period for this offering.
    *   **If either is unavailable:** Continue to the next time slot.

3.  **Handle Failures:**
    *   After trying to place all required periods for an offering, if you could not find enough valid slots, add it to the 'failedSchedules' list.
    *   Provide a clear reason for the failure. The reason should specify whether the constraint was the teacher or the class (e.g., "Teacher 'Teacher Name' has no available slots" or "Class 'Class Name' has no available slots").

**Output:**
Return a JSON object containing two lists:
-   'newSchedules': All the schedule entries you successfully created.
-   'failedSchedules': All the offerings you could not fully schedule, with the specific reason for failure.
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
