import typescript from "@rollup/plugin-typescript";
import screeps from "rollup-plugin-screeps";

export default {
    input: "src/main.ts",
    output: {
        file: "dist/main.js",
        format: "cjs",
        sourcemap: true,
    },
    plugins: [typescript(), screeps({ configFile: "./screeps.json" })],
};
