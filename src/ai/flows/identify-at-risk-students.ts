'use server';

/**
 * @fileOverview Identifies students at risk of failing based on their current raw scores.
 *
 * - identifyAtRiskStudents - A function that identifies students at risk.
 * - IdentifyAtRiskStudentsInput - The input type for the identifyAtRiskStudents function.
 * - IdentifyAtRiskStudentsOutput - The return type for the identifyAtRiskStudents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyAtRiskStudentsInputSchema = z.object({
  studentRecords: z.array(
    z.object({
      studentId: z.string().describe('The ID of the student.'),
      studentName: z.string().describe('The name of the student'),
      rawScore: z.number().describe('The current raw score of the student.'),
    })
  ).describe('An array of student records with their IDs and raw scores.'),
  gradeScale: z.array(
    z.object({
      min_inclusive: z.number().describe('Minimum score for the grade.'),
      max_inclusive: z.number().describe('Maximum score for the grade.'),
      letter: z.string().describe('Letter grade.'),
      grade_point: z.number().describe('Grade point value.'),
      is_pass: z.boolean().describe('Whether the grade is passing.'),
    })
  ).describe('The grading scale used to determine passing grades.'),
});

export type IdentifyAtRiskStudentsInput = z.infer<typeof IdentifyAtRiskStudentsInputSchema>;

const IdentifyAtRiskStudentsOutputSchema = z.object({
  atRiskStudents: z.array(
    z.object({
      studentId: z.string().describe('The ID of the at-risk student.'),
      studentName: z.string().describe('The name of the student'),
      reason: z.string().describe('The reason why the student is considered at risk.'),
    })
  ).describe('An array of students identified as at risk of failing.'),
});

export type IdentifyAtRiskStudentsOutput = z.infer<typeof IdentifyAtRiskStudentsOutputSchema>;

export async function identifyAtRiskStudents(
  input: IdentifyAtRiskStudentsInput
): Promise<IdentifyAtRiskStudentsOutput> {
  return identifyAtRiskStudentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyAtRiskStudentsPrompt',
  input: {schema: IdentifyAtRiskStudentsInputSchema},
  output: {schema: IdentifyAtRiskStudentsOutputSchema},
  prompt: `You are an AI assistant that helps teachers identify students who are at risk of failing a course.

Given the following list of students and their current raw scores, and the grading scale, identify the students who are at risk of failing.

Student Records:
{{#each studentRecords}}
- Student ID: {{this.studentId}}, Student Name: {{this.studentName}}, Raw Score: {{this.rawScore}}
{{/each}}

Grading Scale:
{{#each gradeScale}}
- {{this.min_inclusive}} - {{this.max_inclusive}}: {{this.letter}} ({{this.grade_point}}), Passing: {{this.is_pass}}
{{/each}}

Consider a student at risk if their current raw score is below the passing threshold according to the grading scale.

Output the list of at-risk students with their Student ID, Student Name, and the reason why they are considered at risk.

Format your response as a JSON object with an array of atRiskStudents. Each object in the array should contain the studentId, studentName and reason.
`,
});

const identifyAtRiskStudentsFlow = ai.defineFlow(
  {
    name: 'identifyAtRiskStudentsFlow',
    inputSchema: IdentifyAtRiskStudentsInputSchema,
    outputSchema: IdentifyAtRiskStudentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
