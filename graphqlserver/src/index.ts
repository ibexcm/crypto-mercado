import { Dependencies } from "@ibexcm/libraries/di";
import { config } from "./config";
import { createServer } from "./server/utils/createServer";

const { port, address, protocol } = config.get("express");

const dependencies = new Dependencies();
const server = createServer(dependencies);

server.createHttpServer(server.options).listen(port, address, () => {
  console.log(`Server is running on ${protocol}://${address}:${port}`);
});
