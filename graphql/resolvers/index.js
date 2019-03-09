const authResolver = require("./auth");
const familyResolver = require("./family");
const taskResolver = require("./task");
const rootResolver = {
  ...authResolver,
  ...familyResolver,
  ...taskResolver
};

module.exports = rootResolver;
