export interface User {
    id: string;        // Unique identifier for the user
    username: string;  // Username for the user
    password: string;  // Hashed password
    email?: string;    // Optional email field
    createdAt: Date;   // Timestamp when the user was created
  }