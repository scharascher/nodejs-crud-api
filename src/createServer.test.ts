import { createServer } from './createServer';
import http, { Server } from 'http';
import crypto from 'crypto';
import { User } from './api/users/types';
import * as console from 'console';
import { databaseInstance } from './database';

jest.mock('crypto');
const getMockedUUID = (
  id: number,
): `${string}-${string}-${string}-${string}-${string}` =>
  `${id.toString().repeat(8)}-${id.toString().repeat(4)}-${id
    .toString()
    .repeat(4)}-${id.toString().repeat(4)}-${id.toString().repeat(12)}`;
let currentUUID = 0;

const mockedCrypto = crypto as jest.Mocked<typeof crypto>;
const generateUser = (
  username: string,
  age: number,
  hobbies: string[] = [],
): User => {
  return {
    id: getMockedUUID(currentUUID++),
    username,
    age,
    hobbies,
  };
};
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
describe('createServer', () => {
  let server: Server;

  let mockUsers: User[];

  beforeAll(() => {
    let id = 0;
    currentUUID = 0;
    mockUsers = generateMockUsers(4);
    mockedCrypto.randomUUID.mockImplementation(() => getMockedUUID(id++));
    server = createServer();
    server.listen(3000);
  });

  afterAll(() => {
    server.close();
  });
  describe('get /users', () => {
    const makeRequest = (
      callback: (data: unknown, res: http.IncomingMessage) => void,
    ) => {
      return http.get('http://localhost:3000/api/users', (res) => {
        getData(res, (data) => {
          callback(data, res);
        });
      });
    };
    test('should return status code 200', (done) => {
      try {
        makeRequest((_, res) => {
          expect(res.statusCode).toBe(200);
          done();
        });
      } catch (e) {
        done(e);
      }
    });
    test('should return mockUsers', (done) => {
      try {
        makeRequest((data) => {
          expect(typeof data).toBe('string');
          expect(JSON.parse(data as string)).toEqual(mockUsers);
          console.log(done);
          done();
        });
      } catch (e) {
        done(e);
      }
    });
    test('should return an emptyArray in case of no users', (done) => {
      try {
        jest.spyOn(databaseInstance, 'getUsers').mockReturnValueOnce([]);
        makeRequest((data) => {
          expect(JSON.parse(data as string)).toEqual([]);
          done();
        });
      } catch (e) {
        done(e);
      }
    });
  });
});
