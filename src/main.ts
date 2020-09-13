import { gc } from "./gc";
import { do_spawn } from "./spawn";

import * as bootstrap_harvester_job from "./job/bootstrap_harvester";
import * as idle_job from "./job/idle";

export const loop = () => {
    // generatePixel only exists in production apparently
    if (Game.cpu.bucket > 5000 && "generatePixel" in Game.cpu) {
        Game.cpu.generatePixel();
    }

    gc();
    do_spawn();

    for (let creep_name in Game.creeps) {
        let creep = Game.creeps[creep_name];
        let job = idle_job;
        if (creep.memory.job_name === "bootstrap_harvester") {
            job = bootstrap_harvester_job;
        }

        job.clean_memory(creep);
        job.run(creep);
    }
};
