"use strict";

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import multi from "@rollup/plugin-multi-entry";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

let config = {
    external: ["lodash", "chai"],
    input: "test/integration/**/*.test.ts",
    output: {
        file: "dist/test-integration.js",
        format: "cjs",
        sourcemap: true,
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript({ noImplicitAny: false }),
        multi(),
        json(),
    ],
};

export default config;
