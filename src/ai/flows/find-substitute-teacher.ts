
'use server';

/**
 * @fileOverview Finds a suitable substitute teacher based on availability and workload.
 *
 * - findSubstituteTeacher - A function that performs the search.
 * - FindSubstituteTeacherInput - The input type for the function.
 * - FindSubstituteTeacherOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { User, Schedule, DayOfWeek, Offering } from '@/lib/types';


const TeacherSchema = z.object({
  email: z.string().describe('The email of the teacher.'),
  name: z.string().describe('The full name of the teacher.'),
});

const ScheduleSchema = z.object({
    scheduleId: z.string(),
    offeringId: z.string(),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']),
    period: z.number(),
});

const OfferingSchema = z.object({
  offeringId: z.string(),
  subjectId: z.string(),
  classId: z.string(),
  teacherEmail: z.string(),
  yearBe: z.number(),
});

const FindSubstituteTeacherInputSchema = z.object({
    requestingTeacher: TeacherSchema.describe("The teacher who is requesting leave."),
    leaveDate: z.string().describe("The date of the leave in YYYY-MM-DD format."),
    leaveReason: z.string().describe("The reason for the leave."),
    affectedPeriods: z.array(z.number()).describe("An array of class period numbers that need a substitute."),
    allSchedules: z.array(ScheduleSchema).describe("The entire school's schedule for all teachers."),
    allTeachers: z.array(TeacherSchema).describe("A list of all available teachers in the school."),
    allOfferings: z.array(OfferingSchema).describe("A list of all course offerings."),
});

export type FindSubstituteTeacherInput = z.infer<typeof FindSubstituteTeacherInputSchema>;

const FindSubstituteTeacherOutputSchema = z.object({
  substituteTeacher: TeacherSchema.describe("The selected substitute teacher."),
  justification: z.string().describe("A brief explanation in Thai for why this teacher was chosen."),
  notificationMessage: z.string().describe("A message in Thai to be sent to the substitute teacher, informing them of the assignment details (date, periods, reason for original teacher's absence)."),
});

export type FindSubstituteTeacherOutput = z.infer<typeof FindSubstituteTeacherOutputSchema>;


export async function findSubstituteTeacher(
  input: FindSubstituteTeacherInput
): Promise<FindSubstituteTeacherOutput> {
  // --- Step 1: Pre-filter teachers in TypeScript ---
  const leaveDay = getDayOfWeekFromDate(input.leaveDate);

  // Create a map of offeringId -> teacherEmail
  const offeringTeacherMap = new Map<string, string>();
  input.allOfferings.forEach(o => {
    offeringTeacherMap.set(o.offeringId, o.teacherEmail);
  });

  // Find which teachers are busy during the affected periods on the leave day
  const busyTeachers = new Set<string>();
  input.allSchedules.forEach(schedule => {
      if (schedule.dayOfWeek === leaveDay && input.affectedPeriods.includes(schedule.period)) {
          const teacherEmail = offeringTeacherMap.get(schedule.offeringId);
          if (teacherEmail) {
            busyTeachers.add(teacherEmail);
          }
      }
  });

  // Filter out teachers who are busy or are the one requesting leave
  const potentialSubstitutes = input.allTeachers.filter(teacher => 
      teacher.email !== input.requestingTeacher.email &&
      !busyTeachers.has(teacher.email)
  );

  if (potentialSubstitutes.length === 0) {
      throw new Error("ไม่สามารถหาครูที่ว่างตามเงื่อนไขได้");
  }

  // --- Step 2: Use AI to make the final selection and generate messages ---
  return findSubstituteTeacherFlow({ 
    potentialSubstitutes, 
    leaveInfo: {
        requestingTeacher: input.requestingTeacher,
        leaveDate: input.leaveDate,
        leaveReason: input.leaveReason,
        affectedPeriods: input.affectedPeriods,
    } 
  });
}

// Helper function to get the day of the week from a date string
function getDayOfWeekFromDate(dateString: string): DayOfWeek {
    const date = new Date(dateString);
    const dayIndex = date.getDay(); // Sunday - 0, Monday - 1, ...
    const days: DayOfWeek[] = ['SUNDAY' as any, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY' as any];
    return days[dayIndex];
}

const AISubstituteInputSchema = z.object({
    potentialSubstitutes: z.array(TeacherSchema),
    leaveInfo: z.object({
         requestingTeacher: TeacherSchema.describe("The teacher who is requesting leave."),
        leaveDate: z.string().describe("The date of the leave in YYYY-MM-DD format."),
        leaveReason: z.string().describe("The reason for the leave."),
        affectedPeriods: z.array(z.number()).describe("An array of class period numbers that need a substitute."),
    }),
});

const prompt = ai.definePrompt({
    name: 'substituteSelectionPrompt',
    input: { schema: AISubstituteInputSchema },
    output: { schema: FindSubstituteTeacherOutputSchema },
    prompt: `You are an expert school administrator AI. Your task is to select the best substitute teacher from a pre-filtered list of candidates and generate appropriate messages. Your response must be in Thai.

The teacher, {{leaveInfo.requestingTeacher.name}}, has requested leave on {{leaveInfo.leaveDate}} for the following reason: "{{leaveInfo.leaveReason}}".
This affects class periods: {{#each leaveInfo.affectedPeriods}}{{@index + 1}}: {{this}}{{/each}}.

Here is a list of potential substitute teachers who are available during these times:
{{#each potentialSubstitutes}}
- {{this.name}} ({{this.email}})
{{/each}}

Your tasks:
1.  **Select the best substitute teacher:** From the list above, choose ONE teacher. If there are multiple options, you can choose any of them. There is no special priority.
2.  **Provide justification:** Briefly explain in Thai why you chose this teacher (e.g., "เนื่องจากเป็นครูท่านเดียวที่ว่างในคาบเรียนดังกล่าว" or "เนื่องจากเป็นครูที่ว่างในคาบเรียนดังกล่าว").
3.  **Create a notification message:** Write a clear, polite message in Thai to be sent to the chosen substitute teacher. This message must include:
    - The name of the teacher they are substituting for.
    - The date of the substitution.
    - The specific class period(s).
    - A polite request to take over the class.

Format your entire response as a single JSON object matching the required output schema.
`,
});

const findSubstituteTeacherFlow = ai.defineFlow(
  {
    name: 'findSubstituteTeacherFlow',
    inputSchema: AISubstituteInputSchema,
    outputSchema: FindSubstituteTeacherOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
