import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Score } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateGPA(scores: Score[]): string {
  let totalPoints = 0;
  let totalCredits = 0;

  scores.forEach(score => {
    // Only include scores that are normal and have a grade point
    if (score.statusFlag === 'NORMAL' && score.gradePoint !== null && score.credits > 0) {
      totalPoints += score.gradePoint * score.credits;
      totalCredits += score.credits;
    }
    // '0' status counts as 0 grade points
    if (score.statusFlag === '0' && score.credits > 0) {
      totalPoints += 0 * score.credits;
      totalCredits += score.credits;
    }
    // 'ร' and 'มผ' are not included in GPA calculation
  });

  if (totalCredits === 0) {
    return "0.00";
  }

  const gpa = totalPoints / totalCredits;
  return gpa.toFixed(2);
}
