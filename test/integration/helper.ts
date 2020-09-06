const { readFileSync } = require("fs");
const fs = require("fs").promises;
const _ = require("lodash");
const { ScreepsServer, stdHooks } = require("screeps-server-mockup");
const DIST_MAIN_JS = "dist/main.js";

export const START_ROOM = "W0N1";

/*
 * Helper class for creating a ScreepsServer and resetting it between tests.
 * See https://github.com/Hiryus/screeps-server-mockup for instructions on
 * manipulating the terrain and game state.
 */
class IntegrationTestHelper {
    public server: any;
    public player: any;

    async beforeEach() {
        this.server = new ScreepsServer();

        // reset world but add invaders and source keepers bots
        await this.server.world.reset();

        // create a stub world composed of 9 rooms with sources and controller
        await this.server.world.stubWorld();

        let script = await fs.readFile(DIST_MAIN_JS, { encoding: "utf-8" });

        // add a player with the built dist/main.js file
        const modules = {
            main: script,
        };
        this.player = await this.server.world.addBot({
            username: "player",
            room: START_ROOM,
            x: 15,
            y: 15,
            modules,
        });

        // Emit console logs when internal scripts use the console
        this.player.on("console", (logs, results, userid, username) => {
            for (let line of logs) {
                console.log(`[console|${username}]`, line);
            }
        });

        // Start server
        await this.server.start();
    }

    async afterEach() {
        await this.server.stop();
    }
}

beforeEach(async () => {
    await helper.beforeEach();
});

afterEach(async () => {
    await helper.afterEach();
});

before(() => {
    stdHooks.hookWrite();
});

export const helper = new IntegrationTestHelper();
