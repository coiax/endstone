"use strict";

import typescript from "@rollup/plugin-typescript";
import screeps from "rollup-plugin-screeps";

let config = {
    input: "src/main.ts",
    output: {
        file: "dist/main.js",
        format: "cjs",
        sourcemap: true,
    },
    plugins: [typescript()],
};

if (process.env.UPLOAD) {
    config.plugins.push(screeps({ configFile: "./screeps.json" }));
}

export default config;
