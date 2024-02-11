import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import { updateUser } from './storage';
import {
  checkInvalidUserId,
  sendInvalidJson,
  sendInvalidUserFields,
  validateUser,
} from './utils';

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
      checkInvalidUserId(res, id);
      if (!validateUser(userBody)) {
        return sendInvalidUserFields(res);
      }
      const createdUser = updateUser(id, userBody);
      return sendResponse(res, 200, createdUser);
    } catch (e) {
      return sendInvalidJson(res);
    }
  });
};
