import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import {
  sendInvalidJson,
  sendInvalidUserFields,
  sendInvalidUserId,
  sendUserNotFound,
  validateUser,
} from './utils';
import { validateUuid } from '../../utils/validateUuid';
import { getDatabase } from '../../database';

export const apiUsersPut = (
  req: Http.IncomingMessage,
  res: Http.ServerResponse,
  path: string,
) => {
  let requestBody = '';

  req.on('data', (chunk) => {
    requestBody += chunk.toString();
  });

  req.on('end', () => {
    try {
      const userBody = JSON.parse(requestBody);
      const id = path;
      if (!validateUuid(id)) return sendInvalidUserId(res);
      if (!validateUser(userBody)) {
        return sendInvalidUserFields(res);
      }
      const createdUser = getDatabase().updateUser(id, userBody);
      if (!createdUser) return sendUserNotFound(res);
      return sendResponse(res, 200, createdUser);
    } catch (e) {
      return sendInvalidJson(res);
    }
  });
};
