import { config } from 'dotenv';
config();

import '@/ai/flows/identify-at-risk-students.ts';
import '@/ai/flows/analyze-student-scores.ts';
import '@/ai/flows/find-substitute-teacher.ts';
