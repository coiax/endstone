import { assert } from "chai";
import sinon from "sinon";
import { do_spawn } from "../../src/spawn";

const fake = sinon.fake;

const room = {
    name: "W12N34",
    find: fake(() => []),
};

const spawn = {
    room: room,
    name: "Spawn1",
    spawnCreep: fake(),
};

describe("spawn", function () {
    beforeEach(function () {
        // @ts-ignore
        global.Game = _.clone({
            creeps: {},
            spawns: {
                Spawn1: spawn,
            },
            rooms: {
                W12N32: room,
            },
        });
    });

    it("should trigger a spawn in an empty room", () => {
        do_spawn();
        let spawnCreep = Game.spawns["Spawn1"].spawnCreep as any;
        assert(spawnCreep.called, "Spawn creep was not called.");
    });
});
