const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { healthRouter, chainRouter, adminRouter } = require('./routes');
const firewallMiddleware = require('./routes/firewall'); // Changed import
const { createAuditLogger } = require('./middleware');

function createApp() {
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  
  const auditLogs = [];
  const auditLogger = createAuditLogger(auditLogs);
  
  adminRouter.setAuditLogs(auditLogs);
  
  // Routes
  app.use('/health', healthRouter);
  app.use('/verify-chain', chainRouter);
  app.use('/admin', auditLogger, adminRouter.router);
  
  // Use the firewall middleware directly for /fw routes
  app.use('/fw', auditLogger, firewallMiddleware);
  
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  });
  
  return app;
}

module.exports = createApp;