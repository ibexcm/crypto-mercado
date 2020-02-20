import { IDependencies } from "@ibexcm/libraries/di";
import { GraphQLServer } from "graphql-yoga";
import { Server as HttpServer } from "http";
import { config } from "../../config";
import { createServer } from "../../server/utils/createServer";

const { port, address } = config.get("express");

export class MockServer {
  private server: GraphQLServer;
  private httpServer: HttpServer;

  constructor(dependencies: IDependencies) {
    this.server = createServer(dependencies);
  }

  async start() {
    this.httpServer = await this.server.start(
      {
        port,
        endpoint: "/graphql",
        playground: "/playground",
        cors: { methods: ["POST"] },
      },
      () => {
        console.log(`Server is running on http://${address}:${port}`);
      },
    );
  }

  stop() {
    this.httpServer.close();
  }
}
