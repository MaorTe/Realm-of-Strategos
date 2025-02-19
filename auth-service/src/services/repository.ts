import { database } from '@maorte/strategos-services-common-package/dist/database';
import { User } from '@maorte/strategos-services-common-package/dist/database/types';
export class AuthRepository {
  
  static async findUserByUsername(username: string): Promise<User | undefined> {
    return await database
      .selectFrom('user')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst() as User;
  }


  static async createUser(username: string, password: string): Promise<User> {
    return await database
        .insertInto('user')
        .values({ username, password })
        .returningAll() // Returns inserted user
        .executeTakeFirst() as User; 
 }
}