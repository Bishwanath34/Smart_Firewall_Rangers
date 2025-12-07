async function checkRiskRule(ctx) {
  let risk = 0.0;
  const reasons = [];

  // Rule 1: anonymous / no user id
  if (!ctx.userId || ctx.userId === "anonymous") {
    risk += 0.2;
    reasons.push("no_user_id");
  }

  // Rule 2: accessing /admin area
  if (ctx.path.startsWith("/admin")) {
    risk += 0.5;
    reasons.push("admin_path");
  }

  // Rule 3: guest trying admin
  if (ctx.path.startsWith("/admin") && ctx.role === "guest") {
    risk += 0.3;
    reasons.push("guest_on_admin_path");
  }

  // Rule 4: HONEYPOT — extremely high risk
  if (ctx.path.startsWith("/honeypot")) {
    risk += 0.8;
    reasons.push("honeypot_path");
  }

  // Label from rule-risk
  let label = "normal";
  if (risk >= 0.7) label = "high_risk";
  else if (risk >= 0.4) label = "medium_risk";

  return { risk, label, reasons };
}

module.exports = { checkRiskRule };