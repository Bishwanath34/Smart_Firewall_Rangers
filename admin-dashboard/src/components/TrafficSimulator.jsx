import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

export default function TrafficSimulator({
  simulateNormalUserInfo,
  simulateSuspiciousGuestAdmin,
  simulateGuestAdminRBAC,
}) {
  return (
    <Paper
      sx={{
        flex: 1,
        p: 2,
        background: "#020617",
        color: "white",
        minWidth: 260,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Traffic Simulator
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: "#9ca3af" }}>
        Generate live traffic for demo.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Button
          variant="contained"
          color="success"
          onClick={simulateNormalUserInfo}
        >
          NORMAL USER → /INFO (ALLOWED)
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={simulateSuspiciousGuestAdmin}
        >
          SUSPICIOUS GUEST → /ADMIN/SECRET
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={simulateGuestAdminRBAC}
        >
          GUEST → ADMIN (RBAC BLOCK)
        </Button>
      </Box>
    </Paper>
  );
}
