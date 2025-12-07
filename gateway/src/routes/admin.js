const express = require('express');
const router = express.Router();
const { requestTracker, getChainStatus, loadChain } = require('../services');

// In-memory audit logs (passed from app.js)
let auditLogs = [];

// Set logs (called from app.js)
function setAuditLogs(logs) {
  auditLogs = logs;
}

// Real-time traffic data
router.get('/traffic-data', (req, res) => {
  res.json(requestTracker.getTrafficData());
});

// View in-memory logs
router.get('/logs', (req, res) => {
  res.json(auditLogs);
});

// View chain
router.get('/chain', (req, res) => {
  try {
    const chain = loadChain();
    res.json({
      valid: true,
      length: chain.length,
      chain,
    });
  } catch (e) {
    console.error("Failed to read chain:", e.message);
    res.status(500).json({
      error: "Failed to load chain",
      details: e.message,
    });
  }
});

// Chain status
router.get('/chain/status', (req, res) => {
  res.json(getChainStatus());
});

module.exports = { router, setAuditLogs };