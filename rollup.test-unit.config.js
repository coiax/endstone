"use strict";

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import multi from "@rollup/plugin-multi-entry";
import commonjs from "@rollup/plugin-commonjs";

let config = {
    external: ["lodash", "chai"],
    input: "test/unit/**/*.test.ts",
    output: {
        file: "dist/test-unit.js",
        sourcemap: true,
        format: "cjs",
        sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript(), multi()],
};

export default config;
