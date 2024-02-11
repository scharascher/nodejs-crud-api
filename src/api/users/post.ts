import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import { addUser } from './storage';
import { sendInvalidJson, sendInvalidUserFields, validateUser } from './utils';

export const apiUsersPost = (
  req: Http.IncomingMessage,
  res: Http.ServerResponse,
) => {
  let requestBody = '';

  req.on('data', (chunk) => {
    requestBody += chunk.toString();
  });

  req.on('end', () => {
    try {
      const userBody = JSON.parse(requestBody);
      if (!validateUser(userBody)) {
        return sendInvalidUserFields(res);
      }
      const createdUser = addUser(
        userBody.username,
        userBody.age,
        userBody.hobbies,
      );

      return sendResponse(res, 201, createdUser);
    } catch (e) {
      return sendInvalidJson(res);
    }
  });
};
