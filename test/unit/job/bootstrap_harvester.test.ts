import { assert } from "chai";
import sinon from "sinon";

const fake = sinon.fake;

import {
    clean_memory,
    run,
    DEFAULT_MEMORY,
} from "../../../src/job/bootstrap_harvester";
import {
    game_stub,
    memory_stub,
    store_factory,
    room_factory,
    creep_factory,
} from "../stubs";

describe("bootstrap_harvester", function () {
    beforeEach(function () {
        // @ts-ignore assigning to global object
        global.Game = _.cloneDeep(game_stub);
        // @ts-ignore
        global.Memory = _.cloneDeep(memory_stub);
    });
    describe("clean_memory", function () {
        it("should clean creep memory if it's not in the right format", function () {
            let creep_name = "bob";
            let memory = {
                job_name: "bootstrap_harvester",
                job_memory: [1, 2, 3],
            };
            let creep = ({
                name: creep_name,
                memory: memory,
            } as unknown) as Creep;

            Game.creeps[creep_name] = creep;
            Memory.creeps[creep_name] = memory;

            clean_memory(creep);

            assert(
                _.isEqual(memory.job_memory, DEFAULT_MEMORY),
                "creep's job memory was not reset to the default"
            );
        });
        it("should leave job memory untouched if it's valid", function () {
            let creep_name = "bob";
            let original_job_memory = { mode: "upgrading" };
            let memory = {
                job_name: "bootstrap_harvester",
                job_memory: _.cloneDeep(original_job_memory),
            };
            let creep = ({
                name: creep_name,
                memory: memory,
            } as unknown) as Creep;

            Game.creeps[creep_name] = creep;
            Memory.creeps[creep_name] = memory;

            clean_memory(creep);

            assert(
                _.isEqual(original_job_memory, memory.job_memory),
                "Memory was reset, despite being in correct format."
            );
        });
    });
    describe("run", function () {
        it("will move towards a source if harvesting and not full", function () {
            let room = room_factory();
            let source = {
                _type: "source",
            };

            room._add(source);

            let creep = creep_factory({
                memory: {
                    job_name: "bootstrap_harvester",
                    job_memory: { mode: "harvesting" },
                },
                harvest: fake.returns(ERR_NOT_IN_RANGE),
                moveTo: fake.returns(OK),
            });

            room._add(creep);

            run(creep);

            sinon.assert.calledOnceWithExactly(creep.harvest as any, source);
            sinon.assert.calledOnceWithExactly(creep.moveTo as any, source);
        });
        it("if harvesting and in range, will not attempt to move", function () {
            let room = room_factory();
            let source = {
                _type: "source",
            };

            room._add(source);

            let creep = creep_factory({
                memory: {
                    job_name: "bootstrap_harvester",
                    job_memory: { mode: "harvesting" },
                },
                harvest: fake.returns(OK),
                moveTo: fake.returns(OK),
            });

            room._add(creep);

            run(creep);

            sinon.assert.calledOnceWithExactly(creep.harvest as any, source);
            sinon.assert.notCalled(creep.moveTo as any);
        });
        it("if harvesting and full, will switch modes", function () {
            let room = room_factory();
            let creep = creep_factory({
                store: store_factory(50, { energy: 50 }),
                memory: {
                    job_name: "bootstrap_harvester",
                    job_memory: { mode: "harvesting" },
                },
                harvest: fake.returns(OK),
                moveTo: fake.returns(OK),
            });
            room._add(creep);

            run(creep);

            sinon.assert.notCalled(creep.harvest as any);

            let job_memory = creep.memory.job_memory;
            assert(
                job_memory.mode == "upgrading",
                "Creep is still in harvesting mode."
            );
        });
        it("if in upgrade mode, and too far to upgrade, will move to controller", function () {
            let room = room_factory();
            let controller = room.controller;
            let creep = creep_factory({
                store: store_factory(50, { energy: 50 }),
                memory: {
                    job_name: "bootstrap_harvester",
                    job_memory: { mode: "upgrading" },
                },
                harvest: fake.returns(ERR_INVALID_TARGET),
                moveTo: fake.returns(OK),
                upgradeController: fake.returns(ERR_NOT_IN_RANGE),
            });
            room._add(creep);

            run(creep);

            sinon.assert.notCalled(creep.harvest as any);
            sinon.assert.calledOnceWithExactly(
                creep.upgradeController as any,
                controller
            );
            sinon.assert.calledOnceWithExactly(creep.moveTo as any, controller);
        });
        it("if in upgrade mode, and in range to upgrade, will not move", function () {
            let room = room_factory();
            let controller = room.controller;
            let creep = creep_factory({
                store: store_factory(50, { energy: 50 }),
                memory: {
                    job_name: "bootstrap_harvester",
                    job_memory: { mode: "upgrading" },
                },
                harvest: fake.returns(ERR_INVALID_TARGET),
                moveTo: fake.returns(ERR_TIRED),
                upgradeController: fake.returns(OK),
            });
            room._add(creep);

            run(creep);

            sinon.assert.notCalled(creep.harvest as any);
            sinon.assert.calledOnceWithExactly(
                creep.upgradeController as any,
                controller
            );
            sinon.assert.notCalled(creep.moveTo as any);
        });
        it("if in upgrade mode, and empty, will switch to harvesting mode", function () {
            let room = room_factory();
            let controller = room.controller;
            let creep = creep_factory({
                store: store_factory(50, { energy: 0 }),
                memory: {
                    job_name: "bootstrap_harvester",
                    job_memory: { mode: "upgrading" },
                },
                harvest: fake.returns(ERR_INVALID_TARGET),
                moveTo: fake.returns(ERR_TIRED),
                upgradeController: fake.returns(OK),
            });
            room._add(creep);

            run(creep);

            let job_memory = creep.memory.job_memory;
            assert(
                job_memory.mode === "harvesting",
                "Creep did not switch to harvesting mode."
            );

            sinon.assert.notCalled(creep.harvest as any);
            sinon.assert.notCalled(creep.moveTo as any);
            sinon.assert.notCalled(creep.upgradeController as any);
        });
    });
});
