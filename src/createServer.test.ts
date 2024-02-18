import { createServer } from './createServer';
import http, { Server } from 'http';
import crypto from 'crypto';
import { User } from './api/users/types';
import * as database from './database';
import { Database } from './database';

const generateUser = (
  username: string,
  age: number,
  hobbies: string[] = [],
): User => {
  return {
    id: crypto.randomUUID(),
    username,
    age,
    hobbies,
  };
};
const PORT = 3001;
const generateMockUsers = (count: 0 | 1 | 2 | 3 | 4) => {
  const users = [
    generateUser('username1', 33, ['hobbie1', 'hobbie2']),
    generateUser('username2', 22, ['hobbie3', 'hobbie2']),
    generateUser('username3', 21, ['hobbie2']),
    generateUser('username4', 45, ['hobbie1']),
  ];
  return users.slice(0, count);
};
const getData = (
  res: http.IncomingMessage,
  callback: (data: unknown) => void,
) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    callback(data);
  });
};
const getAllUsers = (port: number = PORT) => {
  return new Promise<{ data: User[]; res: http.IncomingMessage }>((resolve) =>
    http.get('http://localhost:' + port + '/api/users', (res) => {
      getData(res, (data) => {
        resolve({ data: JSON.parse(data as string), res });
      });
    }),
  );
};
describe('createServer', () => {
  let server: Server;
  beforeEach(() => {
    mockUsers = generateMockUsers(4);
    jest
      .spyOn(database, 'getDatabase')
      .mockReturnValue(new Database(mockUsers));
  });
  beforeAll(() => {
    server = createServer();
    server.listen(PORT);
  });

  afterAll(async () => {
    await new Promise((r) => server.close(r));
  });
  let mockUsers: User[];
  describe('get /users', () => {
    test('should return status code 200', async () => {
      const { res } = await getAllUsers();
      expect(res.statusCode).toBe(200);
    });
    test('should return users', async () => {
      const { data } = await getAllUsers();
      expect(data).toStrictEqual(mockUsers);
    });
    test('should return an emptyArray in case of no users', async () => {
      jest.spyOn(database, 'getDatabase').mockReturnValue(new Database([]));
      const { data } = await getAllUsers();
      expect(data).toStrictEqual([]);
    });
  });
  describe('get /users/:id', () => {
    const makeRequest = (
      id: string,
      callback: (data: unknown, res: http.IncomingMessage) => void,
      port: number = PORT,
    ) => {
      return http.get(
        'http://localhost:' + port + '/api/users/' + id,
        (res) => {
          getData(res, (data) => {
            callback(data, res);
          });
        },
      );
    };

    test('should return status code 200', (done) => {
      try {
        makeRequest(mockUsers[0]!.id, (_, res) => {
          expect(res.statusCode).toBe(200);
          done();
        });
      } catch (e) {
        done(e);
      }
    });
    test('should return requested user', (done) => {
      try {
        makeRequest(mockUsers[1]!.id, (data) => {
          expect(typeof data).toBe('string');
          expect(JSON.parse(data as string)).toEqual(mockUsers[1]);
          done();
        });
      } catch (e) {
        done(e);
      }
    });
    test('should return status code 404 with error', (done) => {
      try {
        jest.spyOn(database, 'getDatabase').mockReturnValue(new Database([]));
        const id = crypto.randomUUID();
        makeRequest(id, (data, res) => {
          expect(res.statusCode).toBe(404);
          expect(JSON.parse(data as string)).toHaveProperty('error');
          done();
        });
      } catch (e) {
        done(e);
      }
    });
  });
  describe('post /users/:id', () => {
    const postUser = (data: Omit<User, 'id'>, port: number = PORT) => {
      return new Promise<{ data: unknown; res: http.IncomingMessage }>(
        (resolve, _) => {
          const postData = JSON.stringify(data);
          const req = http.request(
            {
              hostname: 'localhost',
              port,
              path: '/api/users',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
              },
            },
            (res) => {
              getData(res, (data) => {
                resolve({ data: JSON.parse(data as string), res });
              });
            },
          );
          req.write(postData);
          req.end();
        },
      );
    };
    const userData = { username: 'u', age: 22, hobbies: ['1', '2'] };
    test('should return status code 201 with posted user', async () => {
      const response = await postUser(userData);
      expect(response.res.statusCode).toBe(201);
      expect(response.data).toMatchObject(userData);
    });
    test('last user should be posted user', async () => {
      await postUser(userData);
      const { data: users } = await getAllUsers();
      expect(users[users.length - 1]).toMatchObject(userData);
    });
    test('should send 400 if data is invalid', async () => {
      const { res, data } = await postUser({
        ...userData,
        age: '44' as unknown as number,
      });

      expect(res.statusCode).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });
  describe('put /users/:id', () => {
    const putUser = (
      id: string,
      data: Omit<User, 'id'>,
      port: number = PORT,
    ) => {
      return new Promise<{ data: unknown; res: http.IncomingMessage }>(
        (resolve, _) => {
          const postData = JSON.stringify(data);
          const req = http.request(
            {
              hostname: 'localhost',
              port,
              path: '/api/users/' + id,
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
              },
            },
            (res) => {
              getData(res, (data) => {
                resolve({ data: JSON.parse(data as string), res });
              });
            },
          );
          req.write(postData);
          req.end();
        },
      );
    };
    const userData = { username: 'u', age: 22, hobbies: ['1', '2'] };
    test('should return status code 200 with updated user', async () => {
      const response = await putUser(mockUsers[0]!.id, userData);
      expect(response.res.statusCode).toBe(200);
      expect(response.data).toStrictEqual({
        id: mockUsers[0]!.id,
        ...userData,
      });
    });
    test('should send 400 if new data is invalid', async () => {
      const { res, data } = await putUser(mockUsers[0]!.id, {
        ...userData,
        age: '44' as unknown as number,
      });

      expect(res.statusCode).toBe(400);
      expect(data).toHaveProperty('error');
    });
    test('should send 400 if id is not uuid', async () => {
      const { res, data } = await putUser('notUuid', userData);

      expect(res.statusCode).toBe(400);
      expect(data).toHaveProperty('error');
    });
    test('should send 404 user does not exist', async () => {
      const { res, data } = await putUser(crypto.randomUUID(), userData);

      expect(res.statusCode).toBe(404);
      expect(data).toHaveProperty('error');
    });
  });
  describe('put /users/:id', () => {
    const deleteUser = (id: string, port: number = PORT) => {
      return new Promise<{ res: http.IncomingMessage; data: unknown }>(
        (resolve, _) => {
          const req = http.request(
            {
              hostname: 'localhost',
              port,
              path: '/api/users/' + id,
              method: 'DELETE',
            },
            (res) => {
              getData(res, (data) => {
                resolve({
                  res,
                  data: data ? JSON.parse(data as string) : null,
                });
              });
            },
          );
          req.end();
        },
      );
    };
    test('should return status code 204', async () => {
      const response = await deleteUser(mockUsers[0]!.id);
      expect(response.res.statusCode).toBe(204);
    });
    test('should send 400 if id is not uuid', async () => {
      const { res, data } = await deleteUser('notUuid');

      expect(res.statusCode).toBe(400);
      expect(data).toHaveProperty('error');
    });
    test('should send 404 user does not exist', async () => {
      const { res, data } = await deleteUser(crypto.randomUUID());

      expect(res.statusCode).toBe(404);
      expect(data).toHaveProperty('error');
    });
  });
});
