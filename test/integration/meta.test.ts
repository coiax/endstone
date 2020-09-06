import { assert } from "chai";
import { helper } from "./helper";

describe("integration meta", function () {
    it("runs a server and matches the game tick", async function () {
        // This can be time consuming, increase the timeout
        this.timeout(4000);
        let server = helper.server;
        for (let i = 1; i < 10; i += 1) {
            assert.equal(await server.world.gameTime, i);
            await server.tick();
        }
    });
});
