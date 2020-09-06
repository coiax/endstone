import { Chance } from "chance";

const chance = Chance();

export const do_spawn = () => {
    for (const sname in Game.spawns) {
        let spawn = Game.spawns[sname];
        let room = spawn.room;
        let creeps = room.find(FIND_MY_CREEPS);
        if (!creeps.length) {
            let body = [CARRY, WORK, MOVE];
            let name = chance.name();
            spawn.spawnCreep(body, name);
        }
    }
};
