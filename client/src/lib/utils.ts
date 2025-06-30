import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString();
}

export function generateSecureToken(): string {
  return 'tk_' + Math.random().toString(36).substr(2, 16);
}

export function calculateAptitudeScore(answers: Record<string, string>): number {
  const correctAnswers = {
    aptitude1: "60",
    aptitude2: "Nail", 
    aptitude3: "3 hours",
    aptitude4: "32",
    aptitude5: "Ocean"
  };
  
  let score = 0;
  Object.entries(correctAnswers).forEach(([question, correct]) => {
    if (answers[question] === correct) {
      score++;
    }
  });
  
  return score;
}
