import { Dependencies } from "@ibexcm/libraries/di";
import { config } from "./config";
import { BitcoinAPIRepositoryInjectionKey } from "./libraries/Crypto/InjectionKeys";
import { createServer } from "./server/utils/createServer";

const { port, address, protocol, endpoint } = config.get("express");

const dependencies = new Dependencies();
const server = createServer(dependencies);

server
  .createHttpServer({
    ...server.options,
  })
  .listen(port, address, () => {
    console.log(`Server is running on ${protocol}://${address}:${port}`);

    const BitcoinApiRepository = dependencies.provide(BitcoinAPIRepositoryInjectionKey);
    BitcoinApiRepository.connectToPriceFeedProvider();
  });
