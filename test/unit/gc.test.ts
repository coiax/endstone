import { assert } from "chai";

import { gc } from "../../src/gc";

import { game_stub, memory_stub } from "./stubs";

describe("garbarge-collection", function () {
    beforeEach(function () {
        // @ts-ignore assigning to global object
        global.Game = _.cloneDeep(game_stub);
        // @ts-ignore
        global.Memory = _.cloneDeep(memory_stub);
    });
    it("should delete creep Memory when creeps are not present", function () {
        let creep_name = "bob";

        Memory.creeps[creep_name] = { job_name: "scout" };

        gc();

        assert(
            !(creep_name in Memory.creeps),
            "Creep that is no longer present still has memory entry."
        );
    });
    it("should keep Creep memory that still exists", function () {
        let creep_name = "betty";

        Game.creeps[creep_name] = { name: creep_name } as Creep;
        Memory.creeps[creep_name] = { job_name: "idler" };

        gc();

        assert(
            creep_name in Memory.creeps,
            "Creep that is no longer present still has memory entry."
        );
    });
    it("should remove Spawn memory for missing spawns", function () {
        let spawn_name = "ForwardBase";

        Memory.spawns[spawn_name] = {
            owned: ["mortimer", "bella"],
        } as SpawnMemory;

        gc();

        assert(
            !(spawn_name in Memory.spawns),
            "Spawn no longer present still has memory entry."
        );
    });
    it("should keep Memory for present spawns", function () {
        let spawn_name = "CoreUnit23";
        Memory.spawns[spawn_name] = {
            owned: ["daniel", "jennifer"],
        } as SpawnMemory;
        Game.spawns[spawn_name] = { name: spawn_name } as StructureSpawn;

        gc();

        assert(
            spawn_name in Memory.spawns,
            "Spawn that is alive had memory entry removed."
        );
    });
});
