// src/utils/simulateTraffic.js

export function simulateTraffic({ path, userId, role }) {
  const event = {
    timestamp: Date.now(),
    path,
    context: { userId, role },
    statusCode: decideStatus(path, role),
    decision: getDecision(path, role),
  };

  // dispatch event to logs store
  const stored = JSON.parse(localStorage.getItem("logs") || "[]");
  stored.push(event);
  localStorage.setItem("logs", JSON.stringify(stored));

  return event;
}

function decideStatus(path, role) {
  if (path.startsWith("/admin") && role !== "admin") return 403;
  if (path.includes("secret")) return 401;
  return 200;
}

function getDecision(path, role) {
  if (path.startsWith("/admin") && role !== "admin") {
    return { label: "rbac_block" };
  }
  if (path.includes("secret")) {
    return { label: "high_risk" };
  }
  return { label: "allowed" };
}
