export const NOTES_API_BASE_URL = import.meta.env.VITE_NOTES_API_BASE_URL
  || 'https://notebook-service-91248372939.us-central1.run.app/api';

export const NOTEBOOK_ERROR_MESSAGES = {
  missingTitle: "Please enter a notebook title.",
  missingSources: "Please add at least one source (file or URL) to create a notebook.",
  createFailed: "Failed to create notebook. Please try again.",
  loadFailed: "Unable to load data. Please check your connection.",
  uploadFailed: "Failed to upload some sources.",
  chatError: "Sorry, I encountered an error responding to that.",

  // File validation messages — used in NotebookCreate.tsx validateFile()
  unsupportedFile: (ext: string) =>
    `Unsupported format "${ext}". Only PDF, DOCX, PPTX and TXT files are allowed.`,
  fileTooLarge: (name: string, maxMb: number) =>
    `"${name}" exceeds the ${maxMb}MB size limit.`,
  invalidMimeType: (name: string) =>
    `"${name}" appears to be corrupted or renamed. Please check the file and try again.`,
};
