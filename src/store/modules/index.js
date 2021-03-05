import { camelCase } from "lodash";

const requiredModules = require.context(
  ".",
  true,
  /^\.\/[a-zA-Z]+\/[a-zA-Z]+\.js$/
);
const modules = {};

requiredModules.keys().forEach(fileName => {
  let regActions = /actions.js$/;
  let regMutations = /mutations.js$/;
  let regGetters = /getters.js$/;
  let regStates = /state.js$/;
  let regProperties = /properties/;

  if (fileName.search(regActions) !== -1) return;
  else if (fileName.search(regMutations) !== -1) return;
  else if (fileName.search(regGetters) !== -1) return;
  else if (fileName.search(regStates) !== -1) return;
  else if (fileName.search(regProperties) !== -1) return;

  const moduleName = camelCase(fileName.replace(/(\.\/[a-zA-Z]+\/|\.js)/g, ""));

  modules[moduleName] = {
    namespaced: true,
    ...requiredModules(fileName).default
  };
});
export default modules;
