module.exports = {
  RBAC: {
    guest: {
      allow: ["/info"],
      deny: ["/admin", "/admin/secret", "/admin/*"],
    },
    user: {
      allow: ["/info", "/profile"],
      deny: ["/admin", "/admin/*"],
    },
    admin: {
      allow: ["*"],
      deny: [],
    },
  },

  checkRBAC: function(role, pathReq) {
    const rules = this.RBAC[role] || this.RBAC["guest"];

    // SPECIAL CASE: HONEYPOT SHOULD NOT BE BLOCKED BY RBAC
    if (pathReq.startsWith("/honeypot")) return true;

    // Admin => everything
    if (rules.allow.includes("*")) return true;

    // Deny rules first
    for (const d of rules.deny) {
      if (pathReq.startsWith(d.replace("*", ""))) return false;
    }

    // Allow rules
    for (const a of rules.allow) {
      if (pathReq.startsWith(a.replace("*", ""))) return true;
    }

    return false;
  }
};