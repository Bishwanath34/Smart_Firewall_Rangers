const constants = require('./constants');
const rbac = require('./rbac');

module.exports = {
  ...constants,
  ...rbac
};