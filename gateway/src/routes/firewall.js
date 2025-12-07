const axios = require('axios');
const { buildContext, checkRiskRule, scoreWithML, rbacMiddleware } = require('../middleware');
const { BACKEND, HIGH_RISK_THRESHOLD, MEDIUM_RISK_THRESHOLD, BLOCK_THRESHOLD } = require('../config');

// Export a middleware function instead of a router
const firewallMiddleware = async (req, res, next) => {
  const ctx = buildContext(req);
  req.ctx = ctx;

  // 1) RBAC check
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

  // 2) Rule engine
  const ruleDecision = await checkRiskRule(ctx);
  ctx.risk_rule = ruleDecision.risk;

  // 3) ML engine
  const ml = await scoreWithML(ctx);

  // 4) Combine
  const finalRisk = Math.max(ruleDecision.risk, ml.ml_risk);
  let finalLabel = "normal";
  if (finalRisk >= HIGH_RISK_THRESHOLD) finalLabel = "high_risk";
  else if (finalRisk >= MEDIUM_RISK_THRESHOLD) finalLabel = "medium_risk";

  const allow = finalRisk < BLOCK_THRESHOLD;

  req.decision = {
    allow,
    risk: finalRisk,
    label: finalLabel,
    rule_risk: ruleDecision.risk,
    rule_label: ruleDecision.label,
    ml_risk: ml.ml_risk,
    ml_label: ml.ml_label,
  };

  // Block if threshold exceeded
  if (!allow) {
    return res.status(403).json({
      message: "Blocked by AI-NGFW",
      decision: req.decision,
    });
  }

  // Forward to backend
  const forwardPath = req.originalUrl;
  const target = BACKEND + forwardPath;

  try {
    const response = await axios({
      method: req.method,
      url: target,
      data: req.body,
      headers: { ...req.headers, host: undefined },
      validateStatus: () => true,
    });

    // Set response headers
    res.set('x-ngfw-rule-risk', ruleDecision.risk.toString());
    res.set('x-ngfw-ml-risk', ml.ml_risk.toString());
    res.set('x-ngfw-final-risk', finalRisk.toString());
    res.set('x-ngfw-label', finalLabel);

    res.status(response.status).json(response.data);
  } catch (err) {
    next({
      status: 500,
      message: "Error forwarding to backend",
      details: err.message,
      decision: req.decision
    });
  }
};

// Helper function (move from config or define here)
function checkRBAC(role, pathReq) {
  const RBAC = {
    guest: { allow: ["/info"], deny: ["/admin", "/admin/secret", "/admin/*"] },
    user: { allow: ["/info", "/profile"], deny: ["/admin", "/admin/*"] },
    admin: { allow: ["*"], deny: [] }
  };
  
  const rules = RBAC[role] || RBAC["guest"];
  if (pathReq.startsWith("/honeypot")) return true;
  if (rules.allow.includes("*")) return true;
  
  for (const d of rules.deny) {
    if (pathReq.startsWith(d.replace("*", ""))) return false;
  }
  
  for (const a of rules.allow) {
    if (pathReq.startsWith(a.replace("*", ""))) return true;
  }
  
  return false;
}

module.exports = firewallMiddleware;