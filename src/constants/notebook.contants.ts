// In a real app, prefer import.meta.env.VITE_NOTES_API_BASE_URL
// For this standalone demo, we default to a placeholder or localhost
export const NOTES_API_BASE_URL = 'https://notebook-service-91248372939.us-central1.run.app/api'; 

export const NOTEBOOK_ERROR_MESSAGES = {
  missingTitle: "Please enter a notebook title.",
  missingSources: "Please add at least one source (file or URL) to create a notebook.",
  createFailed: "Failed to create notebook. Please try again.",
  loadFailed: "Unable to load data. Please check your connection.",
  uploadFailed: "Failed to upload some sources.",
  chatError: "Sorry, I encountered an error responding to that.",
};
