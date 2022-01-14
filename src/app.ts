import * as http from "http";
import { registerControllers as initializeContainer } from "./containers";
import { UsersController } from "./controllers/users.controller";

const port = process.env.PORT ?? 3000;

export const server = http.createServer();

initializeContainer({
  server,
  controllers: [UsersController],
});
server.listen(port, () => {
  console.log(`server running at port ${port}`);
});
