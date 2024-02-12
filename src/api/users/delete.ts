import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import { sendInvalidUserId, sendUserNotFound } from './utils';
import { validateUuid } from '../../utils/validateUuid';
import { databaseInstance } from '../../database';

export const apiUsersDelete = (
  _: Http.IncomingMessage,
  res: Http.ServerResponse,
  path: string,
) => {
  try {
    const id = path;
    if (!validateUuid(id)) return sendInvalidUserId(res);
    const removed = databaseInstance.removeUser(id);
    if (!removed) {
      return sendUserNotFound(res);
    }
    return sendResponse(res, 204);
  } catch (e) {}
};
