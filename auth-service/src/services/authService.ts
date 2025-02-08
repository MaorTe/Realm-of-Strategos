import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './repository';
import { User } from './types';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const registerUser = async (username: string, password: string): Promise<User> => {
  const existingUser = await AuthRepository.findUserByUsername(username);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
  };

  await AuthRepository.createUser(newUser.username, newUser.password);
  return newUser as User;
};

export const loginUser = async (username: string, password: string): Promise<string> => {
  const user = await AuthRepository.findUserByUsername(username);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
};