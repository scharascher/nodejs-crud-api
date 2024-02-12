import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import { sendInvalidUserId, sendUserNotFound } from './utils';
import { validateUuid } from '../../utils/validateUuid';
import { databaseInstance } from '../../database';

export const apiUsersGet = (
  _: Http.IncomingMessage,
  res: Http.ServerResponse,
  path: string,
) => {
  const id = path;
  if (!id) return sendResponse(res, 200, databaseInstance.getUsers());
  if (!validateUuid(id)) {
    return sendInvalidUserId(res);
  }
  const user = databaseInstance.getUser(id);
  if (!user) {
    return sendUserNotFound(res);
  }
  return sendResponse(res, 200, user);
};
