"use strict";

global._ = require("lodash");
global.chai = require("chai");
global.sinon = require("sinon");

const constants = require("./screeps-exports.js");
for (const key in constants) {
    global[key] = constants[key];
}
