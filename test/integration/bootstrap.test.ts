import { assert } from "chai";
import { helper, START_ROOM } from "./helper";

describe("bootstrap behaviour", function () {
    it("starts spawning when the room is empty", async function () {
        // @ts-ignore
        let server = helper.server;
        // @ts-ignore
        let player = helper.player;
        await server.tick();
        _.each(await player.newNotifications, ({ message }) =>
            console.log("[notification]", message)
        );

        let objects = await server.world.roomObjects(START_ROOM);

        let spawn: StructureSpawn = _.find(objects, {
            type: "spawn",
        }) as StructureSpawn;

        assert(spawn, "Spawn not found.");
        assert(spawn.spawning, "Spawn is not spawning.");
    });
});
