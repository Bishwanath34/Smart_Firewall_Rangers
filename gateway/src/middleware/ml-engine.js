const axios = require('axios');
const { ML_SERVICE_URL } = require('../config');

async function scoreWithML(ctx) {
  try {
    const res = await axios.post(
      ML_SERVICE_URL,
      {
        method: ctx.method,
        path: ctx.path,
        role: ctx.role,
        userId: ctx.userId,
        userAgent: ctx.userAgent,
        risk_rule: ctx.risk_rule,
      },
      { validateStatus: () => true }
    );

    return {
      ml_risk: res.data.ml_risk,
      ml_label: res.data.ml_label,
    };
  } catch (err) {
    console.error("ML service error:", err.message);
    return { ml_risk: 0.0, ml_label: "normal" };
  }
}

module.exports = { scoreWithML };