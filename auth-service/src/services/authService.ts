import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '@maorte/strategos-services-common-package/src/database';
import logger from '@maorte/strategos-services-common-package/src/logger';
import { User } from '../models/user';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const registerUser = async (username: string, password: string): Promise<User> => {
  const existingUser = await query('SELECT * FROM users WHERE username = $1', [username]);
  if (existingUser.length > 0) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `${Date.now()}`,
    username,
    password: hashedPassword,
    createdAt: new Date(),
  };

  await query('INSERT INTO users (id, username, password, created_at) VALUES ($1, $2, $3, $4)', [
    newUser.id,
    newUser.username,
    newUser.password,
    newUser.createdAt,
  ]);

  return newUser;
};

export const loginUser = async (username: string, password: string): Promise<string> => {
  const user = await query('SELECT * FROM users WHERE username = $1', [username]);
  if (user.length === 0) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return jwt.sign({ id: user[0].id, username: user[0].username }, SECRET_KEY, { expiresIn: '1h' });
};

export const validateToken = (token: string): jwt.JwtPayload | string => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid token');
  }
};