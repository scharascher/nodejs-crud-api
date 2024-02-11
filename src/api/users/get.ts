import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import { getUser, users } from './storage';
import { checkInvalidUserId, checkUserExists } from './utils';

export const apiUsersGet = (
  _: Http.IncomingMessage,
  res: Http.ServerResponse,
  path: string,
) => {
  if (!path) return sendResponse(res, 200, users);
  const id = path;
  checkInvalidUserId(res, id);
  const user = getUser(id);
  checkUserExists(res, user);
  return sendResponse(res, 200, user);
};
