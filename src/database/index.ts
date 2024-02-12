import crypto from 'crypto';
import { User } from '../api/users/types';
export let databaseInstance: Database;
export const createDatabase = () => {
  databaseInstance = new Database();
};
export class Database {
  constructor(
    private users = [
      Database.generateUser('username1', 33, ['hobbie1', 'hobbie2']),
      Database.generateUser('username2', 22, ['hobbie3', 'hobbie2']),
      Database.generateUser('username3', 21, ['hobbie2']),
      Database.generateUser('username4', 45, ['hobbie1']),
    ],
  ) {}
  static generateUser = (
    username: string,
    age: number,
    hobbies: string[] = [],
  ): User => {
    return {
      id: crypto.randomUUID(),
      username,
      age,
      hobbies,
    };
  };

  getUsers = () => {
    return this.users;
  };

  getUser = (id: string) => {
    return this.getUsers().find((u) => u.id === id);
  };
  updateUser = (
    id: string,
    newData: { username: string; age: number; hobbies: string[] },
  ) => {
    const index = this.getUsers().findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...newData, id };
    return this.users[index];
  };
  addUser = (username: string, age: number, hobbies: string[] = []) => {
    const newUser = Database.generateUser(username, age, hobbies);
    this.getUsers().push(newUser);
    return newUser;
  };

  removeUser = (id: string) => {
    const index = this.getUsers().findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.getUsers().splice(index, 1);
    return true;
  };
}
