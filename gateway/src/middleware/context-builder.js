function buildContext(req) {
  return {
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.headers["user-agent"] || "unknown",
    timestamp: new Date().toISOString(),
    userId: req.headers["x-user-id"] || "anonymous",
    role: req.headers["x-user-role"] || "guest",
    risk_rule: 0,
  };
}

module.exports = { buildContext };