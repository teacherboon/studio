'use server';

/**
 * @fileOverview Analyzes a student's academic performance and provides a summary and recommendations.
 *
 * - analyzeStudentScores - A function that performs the analysis.
 * - AnalyzeStudentScoresInput - The input type for the analyzeStudentScores function.
 * - AnalyzeStudentScoresOutput - The return type for the analyzeStudentScores function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentScoresInputSchema = z.object({
  student: z.object({
      studentId: z.string().describe("The student's ID."),
      studentName: z.string().describe("The student's full name.")
  }),
  scores: z.array(
    z.object({
      subjectName: z.string().describe('The name of the subject.'),
      term: z.string().describe('The academic term (e.g., "1/2568" or "2568").'),
      rawScore: z.number().nullable().describe('The raw score obtained.'),
      letterGrade: z.string().nullable().describe('The letter grade received.'),
    })
  ).describe("An array of the student's scores across different subjects and terms."),
});

export type AnalyzeStudentScoresInput = z.infer<typeof AnalyzeStudentScoresInputSchema>;

const AnalyzeStudentScoresOutputSchema = z.object({
  studentName: z.string().describe("The student's full name."),
  summary: z.string().describe('A brief, encouraging summary of the student\'s overall academic performance in Thai.'),
  strengths: z.string().describe('A paragraph identifying the student\'s academic strengths in Thai.'),
  areasForImprovement: z.string().describe('A paragraph identifying areas where the student could improve in Thai.'),
  recommendations: z.string().describe('Actionable recommendations for the student to improve their performance in Thai.'),
});

export type AnalyzeStudentScoresOutput = z.infer<typeof AnalyzeStudentScoresOutputSchema>;

export async function analyzeStudentScores(
  input: AnalyzeStudentScoresInput
): Promise<AnalyzeStudentScoresOutput> {
  return analyzeStudentScoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentScoresPrompt',
  input: {schema: AnalyzeStudentScoresInputSchema},
  output: {schema: AnalyzeStudentScoresOutputSchema},
  prompt: `You are an expert educational AI assistant for a Thai school. Your task is to analyze a student's academic performance based on their scores and provide a constructive, encouraging, and helpful analysis in Thai.

Analyze the provided scores for the student: {{student.studentName}}.

Student's Scores:
{{#each scores}}
- Subject: {{this.subjectName}}, Term: {{this.term}}, Score: {{#if this.rawScore}}{{this.rawScore}}{{else}}N/A{{/if}}, Grade: {{#if this.letterGrade}}{{this.letterGrade}}{{else}}N/A{{/if}}
{{/each}}

Based on this data, provide the following in THAI language:
1.  **studentName**: The name of the student.
2.  **summary**: A brief, encouraging summary of their overall performance.
3.  **strengths**: Identify subjects or trends where the student is performing well. What are their strong points?
4.  **areasForImprovement**: Identify subjects or trends where the student is struggling or could improve. Be gentle and constructive.
5.  **recommendations**: Provide 2-3 specific, actionable recommendations for the student, parents, or teachers to help improve in the identified areas.

Your tone should be supportive and aimed at helping the student succeed.
`,
});

const analyzeStudentScoresFlow = ai.defineFlow(
  {
    name: 'analyzeStudentScoresFlow',
    inputSchema: AnalyzeStudentScoresInputSchema,
    outputSchema: AnalyzeStudentScoresOutputSchema,
  },
  async (input) => {
    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const { output } = await prompt(input);
        return output!;
      } catch (error: any) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error("AI model failed after multiple retries:", error);
          throw new Error(`The AI model is currently overloaded. Please try again later. (Error: ${error.message})`);
        }
        console.warn(`AI model temporarily unavailable, retrying... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
    }
    // This part should be unreachable, but it's here for type safety.
    throw new Error("Failed to get a response from the AI model after multiple attempts.");
  }
);
