const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: "ok",
    service: "AI-NGFW Gateway",
    time: new Date().toISOString(),
  });
});

module.exports = router;