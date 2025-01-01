import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Mock database
const users: User[] = [];

export const registerUser = async (username: string, password: string): Promise<User> => {
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { id: `${Date.now()}`, username, password: hashedPassword, createdAt: new Date() };
  users.push(newUser);
  return newUser;
};

export const loginUser = async (username: string, password: string): Promise<string> => {
  const user = users.find((user) => user.username === username);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
};

export const validateToken = (token: string): jwt.JwtPayload | string => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid token');
  }
};