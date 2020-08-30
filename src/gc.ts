const creep_memory = () => {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
};

const spawn_memory = () => {
    let alive = _.keys(Game.creeps);

    for (const name in Memory.spawns) {
        if (!(name in Game.spawns)) {
            delete Memory.spawns[name];
            continue;
        }

        let spawn = Game.spawns[name];
        if (_.isArray(spawn.memory.owned)) {
            spawn.memory.owned = [];
        }

        spawn.memory.owned = _.intersection(alive, spawn.memory.owned);
    }
};

export const gc = () => {
    creep_memory();
    spawn_memory();
};
