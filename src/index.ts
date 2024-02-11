import http from 'http';
import { sendResponse } from './utils/sendResponse';
import { apiUsersGet } from './api/users/get';
import { apiUsersPost } from './api/users/post';

const PORT = 3000;
const server = http.createServer((req, res) => {
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
});

server.listen(PORT, () => {
  console.log(`Server is running`);
});
