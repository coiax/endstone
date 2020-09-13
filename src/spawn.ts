export const do_spawn = () => {
    let spawned = 0;
    for (const sname in Game.spawns) {
        let spawn = Game.spawns[sname];
        let room = spawn.room;
        let creeps = room.find(FIND_MY_CREEPS);
        if (creeps.length < 2) {
            let body = [CARRY, WORK, MOVE];
            let name = "Creep_" + Game.time.toString() + "_" + spawned;

            spawn.spawnCreep(body, name);
            spawned++;
        }
    }
};
