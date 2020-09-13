import Ajv from "ajv";

const ajv = new Ajv({ logger: false });
const job_memory_schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
        mode: { type: "string", enum: ["harvesting", "upgrading"] },
    },
    required: ["mode"],
};

const validate_memory = ajv.compile(job_memory_schema);

interface BootstrapHarvesterMemory {
    mode: "harvesting" | "upgrading";
}

export const DEFAULT_MEMORY: BootstrapHarvesterMemory = {
    mode: "harvesting",
};

export function clean_memory(creep: Creep): void {
    let job_memory = (creep.memory as any).job_memory;
    let valid = validate_memory(job_memory);
    if (!valid) {
        creep.memory.job_memory = _.cloneDeep(DEFAULT_MEMORY);
    }
}

export function run(creep: Creep): void {
    let job_memory: BootstrapHarvesterMemory = creep.memory.job_memory;
    let harvesting_mode = job_memory.mode === "harvesting";
    let has_capacity = creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    let empty = creep.store[RESOURCE_ENERGY] == 0;

    if (harvesting_mode) {
        if (has_capacity) {
            let sources = creep.room.find(FIND_SOURCES);
            let source = sources[0];

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            job_memory.mode = "upgrading";
        }
    } else {
        if (empty) {
            job_memory.mode = "harvesting";
        } else {
            if (
                creep.upgradeController(creep.room.controller!) ==
                ERR_NOT_IN_RANGE
            ) {
                creep.moveTo(creep.room.controller!);
            }
        }
    }
}
