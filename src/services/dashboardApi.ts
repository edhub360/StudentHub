import { QuizDashboardSummary, WeeklyActivityResponse } from '../types/dashboard.types';

const API_BASE_URL = 'https://quiz-backend-91248372939.us-central1.run.app'; // Adjust as needed for your backend environment

export async function fetchDashboardSummary(userId: string): Promise<QuizDashboardSummary> {
  try {
    // In a real scenario, this fetches from the backend
    const response = await fetch(`${API_BASE_URL}/dashboard/summary?user_id=${userId}`);
    
      if (!response.ok) {
        throw new Error(`Error fetching dashboard summary: ${response.statusText}`);
      }
      return await response.json();

    // MOCKING the response for this standalone demo so the UI works immediately
    // Remove this mock block and uncomment the fetch above when connecting to real backend
    // await new Promise(resolve => setTimeout(resolve, 600)); // Simulate latency
    // return {
    //   user_id: userId,
    //   averageScorePercent: 85,
    //   studyTimeSecondsToday: 9000, // 2.5 hours
    //   totalStudySeconds: 169200,   // 47 hours
    //   currentStreakDays: 7
    // };

  } catch (error) {
    console.error("Failed to fetch dashboard summary", error);
    throw error;
  }
}

export async function fetchWeeklyActivity(userId: string): Promise<WeeklyActivityResponse> {
  const response = await fetch(`${API_BASE_URL}/dashboard/weekly-activity?user_id=${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch weekly activity: ${response.statusText}`);
  }
  return response.json();
}