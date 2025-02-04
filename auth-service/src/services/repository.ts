import { database, sql } from "./kysely-config";
import { User } from './types';

export class AuthRepository {
  
  static async findUserByUsername(username: string): Promise<User | undefined> {
    return await database
      .selectFrom('User')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst() as User;
  }

  static async createUser(username: string, password: string): Promise<void> {
    await database
      .insertInto('User')
      .values({
        username,
        password
      })
      .execute();
  }
}