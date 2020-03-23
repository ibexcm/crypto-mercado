import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { MockServer } from "../../../../__test-utils__/mocks";

describe("authenticate", () => {
  const dependencies = new TestDependencies();
  dependencies.override(dbInjectionKey, _ => db);

  const server = new MockServer(dependencies);

  beforeAll(async () => {
    await server.start();
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("authenticates user and returns session", async () => {});
});
