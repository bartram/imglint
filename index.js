const { globSync } = require("glob");

// find a config file
const config = {
  rules: {
    "@imglint/alt-text": {},
  },
};

// find all the matching images in the current directory based on the glob from the config file
const files = globSync("**/*.jpg", { cwd: process.cwd() });

// loop through each file
files.forEach((file) => {
  console.log(file);
  // run all the rules in the config
  Object.keys(config.rules).forEach((rule) => {
    // run the rule on the file
    const module = require(rule);
    console.log(module);
    // const result = rule(file);

    // // if the rule fails, log the error
    // if (!result.passed) {
    //   console.error(result.message);
    // }
  });
});
