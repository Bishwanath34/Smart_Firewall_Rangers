const healthRouter = require('./health');
const chainRouter = require('./chain');
const firewallRouter = require('./firewall');
const adminRouter = require('./admin');

module.exports = {
  healthRouter,
  chainRouter,
  firewallRouter,
  adminRouter
};