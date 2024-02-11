import * as Http from 'http';

export const sendResponse = (
  res: Http.ServerResponse,
  statusCode: number,
  data: unknown,
) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  res.write(JSON.stringify(data));
  res.end();
};
