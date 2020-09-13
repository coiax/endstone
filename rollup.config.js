"use strict";

import typescript from "@rollup/plugin-typescript";
import screeps from "rollup-plugin-screeps";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

let config = {
    input: "src/main.ts",
    output: {
        file: "dist/main.js",
        format: "cjs",
        sourcemap: true,
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript({ exclude: ["test/**"] }),
        json(),
    ],
};

if (process.env.UPLOAD === "true") {
    config.plugins.push(screeps({ configFile: "./screeps.json" }));
}

export default config;
