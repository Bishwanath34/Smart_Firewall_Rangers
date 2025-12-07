const { appendToAuditChain, requestTracker } = require('../services');

function createAuditLogger(inMemoryLogs) {
  return function auditLogger(req, res, next) {
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(body) {
      logResponse(req, res, body);
      return originalSend.call(this, body);
    };
    
    res.json = function(body) {
      logResponse(req, res, body);
      return originalJson.call(this, body);
    };
    
    next();
  };

  function logResponse(req, res, responseBody) {
    const ctx = req.ctx;
    const decision = req.decision || { allow: true, risk: 0, label: "normal" };
    const statusCode = res.statusCode;
    
    // Update request tracker
    requestTracker.increment();
    
    const auditEntry = {
      time: new Date().toISOString(),
      context: ctx,
      decision: decision,
      targetPath: req.originalUrl.replace("/fw", ""),
      statusCode: statusCode,
    };
    
    // Add to in-memory logs
    inMemoryLogs.push(auditEntry);
    
    // Append to blockchain audit chain
    appendToAuditChain(auditEntry);
  }
}

module.exports = { createAuditLogger };