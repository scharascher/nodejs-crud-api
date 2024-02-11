import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import { getUser, users } from './storage';
import { sendInvalidUserId, sendUserNotFound } from './utils';
import { validateUuid } from '../../utils/validateUuid';

export const apiUsersGet = (
  _: Http.IncomingMessage,
  res: Http.ServerResponse,
  path: string,
) => {
  const id = path;
  if (!id) return sendResponse(res, 200, users);
  if (!validateUuid(id)) {
    return sendInvalidUserId(res);
  }
  const user = getUser(id);
  if (!user) {
    return sendUserNotFound(res);
  }
  return sendResponse(res, 200, user);
};
