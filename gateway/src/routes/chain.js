const express = require('express');
const router = express.Router();
const { verifyChain } = require('../services');

// Public chain verification endpoint
router.get('/verify-chain', (req, res) => {
  const result = verifyChain();
  res.json(result);
});

module.exports = router;