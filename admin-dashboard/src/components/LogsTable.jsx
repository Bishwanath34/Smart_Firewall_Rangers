import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

export default function LogsTable({ logs }) {
  const formatTime = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleTimeString();
    } catch {
      return iso;
    }
  };

  return (
    <Paper sx={{ p: 2, background: "#020617" }}>
      <Typography variant="h6" color="white" sx={{ mb: 2 }}>
        Firewall Traffic Logs
      </Typography>

      <TableContainer sx={{ maxHeight: 420 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                "Time",
                "Path",
                "User",
                "Role",
                "Risk",
                "ML Label",
                "Decision",
                "Status",
              ].map((h) => (
                <TableCell key={h} sx={{ color: "white", background: "#020617" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {logs.map((entry, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ color: "white" }}>
                  {formatTime(entry.time)}
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  {entry.context?.path}
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  {entry.context?.userId}
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  {entry.context?.role}
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  <Chip
                    label={entry.decision?.label || "normal"}
                    size="small"
                    color={
                      entry.decision?.label === "high_risk" ||
                      entry.decision?.label === "rbac_block"
                        ? "error"
                        : entry.decision?.label === "medium_risk"
                        ? "warning"
                        : "success"
                    }
                  />
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  <Chip
                    label={entry.decision?.ml_label || "normal"}
                    size="small"
                    variant="outlined"
                    color={
                      entry.decision?.ml_label === "high_risk"
                        ? "error"
                        : entry.decision?.ml_label === "medium_risk"
                        ? "warning"
                        : "success"
                    }
                  />
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  <Chip
                    label={
                      entry.statusCode && entry.statusCode < 400
                        ? "Allowed"
                        : "Blocked"
                    }
                    size="small"
                    color={
                      entry.statusCode && entry.statusCode < 400
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>

                <TableCell sx={{ color: "white" }}>{entry.statusCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {logs.length === 0 && (
          <Typography sx={{ color: "white", p: 2, textAlign: "center" }}>
            No logs yet.
          </Typography>
        )}
      </TableContainer>
    </Paper>
  );
}
