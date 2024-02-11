import crypto from 'crypto';
import { User } from './types';

const generateUser = (
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
export const users = [
  generateUser('username1', 33, ['hobbie1', 'hobbie2']),
  generateUser('username2', 22, ['hobbie3', 'hobbie2']),
  generateUser('username3', 21, ['hobbie2']),
  generateUser('username4', 45, ['hobbie1']),
];

export const getUser = (id: string) => {
  return users.find((u) => u.id === id);
};
export const updateUser = (
  id: string,
  newData: { username: string; age: number; hobbies: string[] },
) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  users[index] = { ...users[index], ...newData, id };
  return users[index];
};
export const addUser = (
  username: string,
  age: number,
  hobbies: string[] = [],
) => {
  const newUser = generateUser(username, age, hobbies);
  users.push(newUser);
  return newUser;
};

export const removeUser = (id: string) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
};
