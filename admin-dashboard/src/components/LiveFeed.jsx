import React from "react";
import { Box, Typography } from "@mui/material";

export default function LiveFeed({ logs }) {
  const formatTime = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleTimeString();
    } catch {
      return iso;
    }
  };

  const shortPath = (p) => {
    if (!p) return "/";
    if (p.length > 30) return p.slice(0, 27) + "...";
    return p;
  };

  const displayLogs = [...logs].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  return (
    <Box
      sx={{
        flex: 2,
        p: 2,
        background: "#020617",
        color: "white",
        fontFamily: "monospace",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Live Traffic Feed
      </Typography>

      <Typography variant="body2" sx={{ mb: 1, color: "#9ca3af" }}>
        Newest events at the top.
      </Typography>

      <Box
        sx={{
          mt: 1,
          maxHeight: 200,
          overflowY: "auto",
          borderRadius: 1,
          border: "1px solid #1f2937",
          p: 1,
          background: "#020617",
        }}
      >
        {displayLogs.slice(0, 10).map((entry, idx) => {
          const isAllowed = entry.statusCode && entry.statusCode < 400;
          const finalLabel = entry.decision?.label || "normal";
          const mlLabel = entry.decision?.ml_label || "normal";

          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
                fontSize: 12,
              }}
            >
              <span style={{ color: "#6b7280" }}>
                [{formatTime(entry.time)}]
              </span>

              <span>
                {entry.context?.method || "GET"}{" "}
                {shortPath(entry.context?.path)}
              </span>

              <span style={{ color: "#9ca3af" }}>
                (user: {entry.context?.userId || "?"},{" "}
                role: {entry.context?.role || "?"})
              </span>

              <span>
                {isAllowed ? (
                  <span style={{ color: "#4ade80" }}>→ ALLOWED</span>
                ) : (
                  <span style={{ color: "#f87171" }}>→ BLOCKED</span>
                )}
              </span>

              <span style={{ color: "#e5e7eb" }}>
                [{finalLabel} / ML: {mlLabel}]
              </span>
            </Box>
          );
        })}

        {displayLogs.length === 0 && (
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            No traffic yet. Use simulator to generate events.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
