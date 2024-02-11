import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import { getUser, users } from './storage';
import { validateUuid } from '../../utils/validateUuid';

export const apiUsersGet = (
  _: Http.IncomingMessage,
  res: Http.ServerResponse,
  path: string,
) => {
  if (!path) return sendResponse(res, 200, users);
  const id = path;
  if (!validateUuid(id)) {
    return sendResponse(res, 400, { error: 'Invalid user id' });
  }
  const user = getUser(id);
  if (!user) {
    return sendResponse(res, 404, { error: 'User not found' });
  }
  return sendResponse(res, 200, user);
};
