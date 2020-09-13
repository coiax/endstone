import { Chance } from "chance";
const chance = Chance();

import sinon from "sinon";
const fake = sinon.fake;

export const game_stub: Game = {
    creeps: {},
    spawns: {},
} as Game;

export const memory_stub: Memory = {
    creeps: {},
    spawns: {},
} as Memory;

export function store_factory(
    capacity: number,
    contents: { [P in ResourceConstant]?: number } = {}
): StoreDefinition {
    let store = {
        getCapacity: function (resource = undefined) {
            if (resource === undefined) {
                return capacity;
            } else if (resource! in this) {
                return capacity;
            } else {
                return null;
            }
        },
        getUsedCapacity: function (resource = undefined) {
            if (resource === undefined) {
                let total = 0;
                for (const resource_constant in RESOURCES_ALL) {
                    total += this[resource_constant];
                }
                return total;
            } else if (resource! in this) {
                return this[resource!];
            } else {
                return null;
            }
        },
        getFreeCapacity: function (resource = undefined) {
            let capacity = this.getCapacity(resource);
            let used = this.getUsedCapacity(resource);

            if (capacity === null || used === null) {
                return null;
            } else {
                return capacity - used;
            }
        },
    };
    for (const resource of RESOURCES_ALL) {
        store[resource] = 0;
    }
    for (const resource in contents) {
        store[resource] = contents[resource];
    }
    return store as StoreDefinition;
}

interface DebugRoom extends Room {
    _add: any;
}

export function room_factory(): DebugRoom {
    let room = {
        controller: ({ id: 456 } as unknown) as StructureController,
        energyAvailable: 0,
        energyCapacityAvailable: 0,
        memory: {},
        name: "W1N1",
        terminal: undefined,
        find: function (
            type: FindConstant,
            opts: { filter?: any } = {}
        ): Array<any> {
            let result = [] as any;
            if (type === FIND_SOURCES) {
                result = _.filter(this._objects, { _type: "source" });
            }
            return result;
        },
        _objects: [] as Array<any>,
        _add: function (rob) {
            // Adds the given _R_oom_OB_ject to our fake room
            this._objects.push(rob);
            rob.room = this;
        },
    };
    return (room as unknown) as DebugRoom;
}

export function creep_factory(properties): Creep {
    let creep = {
        name: chance.name(),
        store: store_factory(50),
        body: [CARRY, WORK, MOVE],
        memory: { job_name: "idler", job_memory: { idle_time: 123 } },

        harvest: fake.returns(OK),
        moveTo: fake.returns(OK),

        _type: "creep",
    };

    Object.assign(creep, properties);

    Game.creeps[creep.name] = (creep as unknown) as Creep;

    return (creep as unknown) as Creep;
}
