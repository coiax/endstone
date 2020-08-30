import { gc } from "./gc";

export const loop = () => {
    if (Game.cpu.bucket > 5000) {
        Game.cpu.generatePixel();
    }

    gc();
};
