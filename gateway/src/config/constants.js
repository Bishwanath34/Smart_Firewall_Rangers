const path = require('path');

module.exports = {
  BACKEND: "http://localhost:9000",
  PORT: 4000,
  ML_SERVICE_URL: "http://localhost:5000/score",
  AGGREGATION_INTERVAL: 1000, // 1 second
  DATA_RETENTION_MS: 300000, // 5 minutes
  // Updated to point to main db folder
  CHAIN_FILE_PATH: path.join(__dirname, '..', '..', '..', 'db', 'audit_chain.jsonl'),
  HIGH_RISK_THRESHOLD: 0.7,
  MEDIUM_RISK_THRESHOLD: 0.4,
  BLOCK_THRESHOLD: 0.8
};