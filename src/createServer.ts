import http from 'http';
import { sendResponse } from './utils/sendResponse';
import { apiUsersGet } from './api/users/get';
import { apiUsersPost } from './api/users/post';
import { apiUsersDelete } from './api/users/delete';
import { apiUsersPut } from './api/users/put';
import { createDatabase } from './database';

export const createServer = () => {
  createDatabase();
  return http.createServer((req, res) => {
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
        case 'PUT': {
          return apiUsersPut(req, res, restPath);
        }
        case 'DELETE': {
          return apiUsersDelete(req, res, restPath);
        }
        default: {
          return sendResponse(res, 404, { error: 'Method not allowed' });
        }
      }
    } catch (e: unknown) {
      return sendResponse(res, 500, {
        error: e instanceof Error ? e.toString() : 'Server error',
      });
    }
  });
};
