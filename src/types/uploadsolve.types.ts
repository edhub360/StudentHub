export interface SolveImageResponse {
  answer: string;
  mode: string;
  retrieved_chunks?: { text: string; source: string; score: number }[] | null;
  token_count?: number | null;
}

export enum SolveMode {
  STEPS = "steps",
  FINAL = "final"
}

export enum Subject {
  MATH = "Math",
  PHYSICS = "Physics",
  CHEMISTRY = "Chemistry",
  BIOLOGY = "Biology",
  OTHER = "Other"
}
