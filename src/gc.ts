const creep_memory = () => {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
};

const spawn_memory = () => {
    for (const name in Memory.spawns) {
        if (!(name in Game.spawns)) {
            delete Memory.spawns[name];
            continue;
        }
    }
};

export const gc = () => {
    creep_memory();
    spawn_memory();
};
