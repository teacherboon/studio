import type { GradeScale } from '../types';

export const gradeScale: GradeScale[] = [
  { min_inclusive: 80, max_inclusive: 100, letter: 'A', grade_point: 4.0, is_pass: true },
  { min_inclusive: 75, max_inclusive: 79, letter: 'B+', grade_point: 3.5, is_pass: true },
  { min_inclusive: 70, max_inclusive: 74, letter: 'B', grade_point: 3.0, is_pass: true },
  { min_inclusive: 65, max_inclusive: 69, letter: 'C+', grade_point: 2.5, is_pass: true },
  { min_inclusive: 60, max_inclusive: 64, letter: 'C', grade_point: 2.0, is_pass: true },
  { min_inclusive: 55, max_inclusive: 59, letter: 'D+', grade_point: 1.5, is_pass: true },
  { min_inclusive: 50, max_inclusive: 54, letter: 'D', grade_point: 1.0, is_pass: true },
  { min_inclusive: 0, max_inclusive: 49, letter: 'F', grade_point: 0.0, is_pass: false },
];
