import { User } from './types';
import { sendResponse } from '../../utils/sendResponse';
import * as Http from 'http';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const sendInvalidUserId = (res: Http.ServerResponse) => {
  return sendResponse(res, 400, { error: 'Invalid user id' });
};

export const sendUserNotFound = (res: Http.ServerResponse) => {
  return sendResponse(res, 404, { error: 'User not found' });
};

export const sendInvalidUserFields = (res: Http.ServerResponse) => {
  return sendResponse(res, 400, {
    error: 'Invalid user fields',
  });
};
export const sendInvalidJson = (res: Http.ServerResponse) => {
  return sendResponse(res, 400, {
    error: 'Invalid JSON',
  });
};
