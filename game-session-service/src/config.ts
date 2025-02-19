import dotenv from "dotenv";
dotenv.config();

// Helper function to safely get env variables
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`❌ Missing environment variable: ${key}`);
  return value;
};

// Export each variable directly
export const DATABASE_URL = getEnv("DATABASE_URL");