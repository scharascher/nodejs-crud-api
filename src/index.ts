import { createServer } from './createServer';

const PORT = process.env.PORT;
const server = createServer();
server.listen(PORT, () => {
  console.log(`Server is running`);
});
