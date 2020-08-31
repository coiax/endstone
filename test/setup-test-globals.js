"use strict";

global._ = require("lodash");
global.chai = require("chai");

const constants = require("./screeps-exports.js");
for (const key in constants) {
    global[key] = constants[key];
}
