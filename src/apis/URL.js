// Determine the API endpoint based on environment
const isDevelopment = process.env.NODE_ENV === 'development';

// Use local endpoint for development, production endpoint otherwise
export const URL = isDevelopment 
  ? "http://localhost:5155" 
  : "https://appointment123456.azurewebsites.net"; // Replace with your actual production API endpoint
