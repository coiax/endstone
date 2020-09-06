import { gc } from "./gc";
import { do_spawn } from "./spawn";

export const loop = () => {
    if (Game.cpu.bucket > 5000) {
        Game.cpu.generatePixel();
    }

    for (const spawn_name in Game.spawns) {
        let spawn = Game.spawns[spawn_name];
        spawn.spawnCreep([WORK, CARRY, MOVE], "Bob");
    }

    //gc();
    //do_spawn();
};
