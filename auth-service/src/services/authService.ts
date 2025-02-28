import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { AuthRepository } from './repository';
import { User } from '@maorte/strategos-services-common-package/dist/database';
import { HttpError } from '@maorte/strategos-services-common-package/dist/middleware';

export const registerUser = async (username: string, password: string): Promise<User> => {
  
  const existingUser = await AuthRepository.findUserByUsername(username);
  if (existingUser) {
    throw new HttpError('User already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const insertedUser = await AuthRepository.createUser(username, hashedPassword);
  if (!insertedUser) {
    throw new HttpError("User registration failed", 500);
  }

  return insertedUser;
};

export const loginUser = async (username: string, password: string): Promise<string> => {
  const user = await AuthRepository.findUserByUsername(username);
  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpError('Invalid credentials', 401);
  }
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
};