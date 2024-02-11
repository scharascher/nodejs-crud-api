import { User } from './types';

// eslint-disable-next-line
export const validateUser = (user: any): user is Exclude<User, 'id'> => {
  return (
    typeof user === 'object' &&
    user.age &&
    typeof user.age === 'number' &&
    user.hobbies &&
    Array.isArray(user.hobbies) &&
    user.username &&
    typeof user.username === 'string'
  );
};
