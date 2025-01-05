#!/usr/bin/env node

const { globSync } = require("glob");
const path = require("path");

// find a config file
const config = {
  rules: {
    "@imglint/alt-text": {},
  },
};

// find all the matching images in the current directory based on the glob from the config file
const files = globSync("**/*.jpg", { cwd: process.cwd() });

// loop through each file
files.forEach((filename) => {
  const file = path.join(process.cwd(), filename);
  // run all the rules in the config
  Object.keys(config.rules).forEach(async (rule) => {
    // run the rule on the file
    const module = require(rule);
    try {
      await module(file);
    } catch (err) {
      console.error(err.message);
    }
  });
});
