import { Box, Paper, Typography } from "@mui/material";

export default function StatsCards({ total, allowed, highRisk, chainOK }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <Paper sx={{ flex: 1, p: 2, background: "#111827", color: "white" }}>
        <Typography variant="subtitle2">Total Requests</Typography>
        <Typography variant="h4">{total}</Typography>
      </Paper>

      <Paper sx={{ flex: 1, p: 2, background: "#065f46", color: "white" }}>
        <Typography variant="subtitle2">Allowed</Typography>
        <Typography variant="h4">{allowed}</Typography>
      </Paper>

      <Paper sx={{ flex: 1, p: 2, background: "#7f1d1d", color: "white" }}>
        <Typography variant="subtitle2">High-Risk / RBAC Blocks</Typography>
        <Typography variant="h4">{highRisk}</Typography>
      </Paper>

      <Paper
        sx={{
          flex: 1,
          p: 2,
          background: chainOK ? "#064e3b" : "#b91c1c",
          color: "white",
        }}
      >
        <Typography variant="subtitle2">Log Integrity</Typography>
        <Typography variant="h4">{chainOK ? "Verified" : "TAMPERED!"}</Typography>
      </Paper>
    </Box>
  );
}
