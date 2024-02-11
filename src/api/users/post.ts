import * as Http from 'http';
import { sendResponse } from '../../utils/sendResponse';
import { addUser } from './storage';
import { validateUser } from './utils';

export const apiUsersPost = (
  req: Http.IncomingMessage,
  res: Http.ServerResponse,
) => {
  let requestBody = '';

  req.on('data', (chunk) => {
    console.log(chunk);
    requestBody += chunk.toString();
  });

  req.on('end', () => {
    try {
      const userBody = JSON.parse(requestBody);
      if (validateUser(userBody)) {
        const createdUser = addUser(
          userBody.username,
          userBody.age,
          userBody.hobbies,
        );
        return sendResponse(res, 201, createdUser);
      }
      return sendResponse(res, 400, { error: 'Invalid user fields' });
    } catch (e) {
      return sendResponse(res, 400, { error: 'Invalid JSON' });
    }
  });
};
