import http from 'http';
import { sendResponse } from './utils/sendResponse';
import { apiUsersGet } from './api/users/get';
import { apiUsersPost } from './api/users/post';

const PORT = 3000;
const server = http.createServer((req, res) => {
  try {
    const apiPath = '/api';
    const apiUsersPath = '/users';
    if (!req.url || !req.url.startsWith(apiPath + apiUsersPath))
      return sendResponse(res, 404, { error: 'Unknown api url' });
    const restPath = req.url.split('/').slice(3).join('/');
    switch (req.method) {
      case 'GET': {
        return apiUsersGet(req, res, restPath);
      }
      case 'POST': {
        return apiUsersPost(req, res);
      }
      default: {
        return sendResponse(res, 404, { error: 'Method not allowed' });
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      sendResponse(res, 500, { error: e.toString(), stack: e.stack });
    }
    sendResponse(res, 500, { error: 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running`);
});
