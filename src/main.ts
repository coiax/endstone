import { gc } from "./gc";
import { do_spawn } from "./spawn";

export const loop = () => {
    // generatePixel only exists in production apparently
    if (Game.cpu.bucket > 5000 && "generatePixel" in Game.cpu) {
        Game.cpu.generatePixel();
    }

    gc();
    do_spawn();
};
