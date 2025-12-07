const { checkRBAC } = require('../config');

function rbacMiddleware(req, res, next) {
  const ctx = req.ctx;
  const allowedByRole = checkRBAC(ctx.role, ctx.path);
  
  if (!allowedByRole) {
    return next({
      status: 403,
      message: "Blocked by AI-NGFW (RBAC Policy)",
      decision: {
        allow: false,
        risk: 1,
        label: "rbac_block",
        reasons: ["rbac_denied"],
      }
    });
  }
  
  next();
}

module.exports = { rbacMiddleware };