const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { CHAIN_FILE_PATH } = require('../config');

let lastHash = null;
let lastIndex = -1;

// Compute hash for a block
function computeHash(block) {
  const h = crypto.createHash("sha256");
  h.update(
    String(block.index) +
      "|" +
      block.time +
      "|" +
      (block.context.path || "") +
      "|" +
      (block.context.userId || "") +
      "|" +
      (block.context.role || "") +
      "|" +
      (block.decision.label || "") +
      "|" +
      String(block.statusCode) +
      "|" +
      (block.prevHash || "")
  );
  return h.digest("hex");
}

// Load last block (if file already exists) so we continue the chain
function loadLastBlock() {
  try {
    if (!fs.existsSync(CHAIN_FILE_PATH)) return;
    const raw = fs.readFileSync(CHAIN_FILE_PATH, "utf8").trim();
    if (!raw) return;
    const lines = raw.split("\n").filter(Boolean);
    if (!lines.length) return;
    const last = JSON.parse(lines[lines.length - 1]);
    lastHash = last.hash || null;
    lastIndex = typeof last.index === "number" ? last.index : lines.length - 1;
  } catch (e) {
    console.error("Failed to load last chain block:", e.message);
  }
}
loadLastBlock();

// Append a new entry as a block in the chain file
function appendToAuditChain(entry) {
  try {
    const block = {
      index: lastIndex + 1,
      time: entry.time,
      context: {
        path: entry.context?.path,
        userId: entry.context?.userId,
        role: entry.context?.role,
      },
      decision: {
        label: entry.decision?.label,
        risk: entry.decision?.risk,
      },
      statusCode: entry.statusCode,
      prevHash: lastHash,
    };
    block.hash = computeHash(block);

    // Ensure directory exists
    const chainDir = path.dirname(CHAIN_FILE_PATH);
    if (!fs.existsSync(chainDir)) {
      fs.mkdirSync(chainDir, { recursive: true });
    }

    fs.appendFileSync(CHAIN_FILE_PATH, JSON.stringify(block) + "\n");
    lastHash = block.hash;
    lastIndex = block.index;
  } catch (e) {
    console.error("Failed to append to audit chain:", e.message);
  }
}

// Load full chain
function loadChain() {
  if (!fs.existsSync(CHAIN_FILE_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(CHAIN_FILE_PATH, "utf8").trim();
  if (!raw) return [];

  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const chain = [];
  for (const line of lines) {
    try {
      chain.push(JSON.parse(line));
    } catch (err) {
      console.error("Failed to parse chain line:", err);
    }
  }
  return chain;
}

// Verify chain integrity
function verifyChain() {
  const chain = loadChain();

  if (chain.length === 0) {
    return { valid: true, message: "No blocks in chain yet.", blocks: 0 };
  }

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const expectedPrevHash = i === 0 ? null : chain[i - 1].hash;
    
    if (block.prevHash !== expectedPrevHash) {
      return {
        valid: false,
        message: "Audit chain has been tampered with.",
        error: {
          type: "PREV_HASH_MISMATCH",
          index: i,
          expectedPrevHash,
          actualPrevHash: block.prevHash,
        }
      };
    }

    const recomputedHash = computeHash(block);
    if (block.hash !== recomputedHash) {
      return {
        valid: false,
        message: "Audit chain has been tampered with.",
        error: {
          type: "HASH_MISMATCH",
          index: i,
          expectedHash: recomputedHash,
          actualHash: block.hash,
        }
      };
    }
  }

  return { valid: true, message: "Audit chain is valid.", blocks: chain.length };
}

// Get chain status
function getChainStatus() {
  try {
    if (!fs.existsSync(CHAIN_FILE_PATH)) {
      return { valid: true };
    }

    const raw = fs.readFileSync(CHAIN_FILE_PATH, "utf8").trim();
    if (!raw) {
      return { valid: true };
    }

    const lines = raw.split("\n").filter(Boolean);
    let prevHash = null;

    for (const line of lines) {
      const block = JSON.parse(line);
      const expected = computeHash({
        index: block.index,
        time: block.time,
        context: block.context,
        decision: block.decision,
        statusCode: block.statusCode,
        prevHash: block.prevHash,
      });

      if (block.hash !== expected || block.prevHash !== prevHash) {
        return { valid: false };
      }
      prevHash = block.hash;
    }

    return { valid: true };
  } catch (e) {
    console.error("Chain status check failed:", e.message);
    return { valid: false };
  }
}

module.exports = {
  appendToAuditChain,
  loadChain,
  verifyChain,
  getChainStatus,
  computeHash
};