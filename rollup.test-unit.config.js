"use strict";

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import multi from "@rollup/plugin-multi-entry";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

let config = {
    external: ["lodash", "chai", "sinon"],
    input: "test/unit/**/*.test.ts",
    output: {
        file: "dist/test-unit.js",
        sourcemap: true,
        format: "cjs",
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
