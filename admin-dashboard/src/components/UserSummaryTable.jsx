import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function UserSummaryTable({ userSummary }) {
  return (
    <Paper sx={{ p: 2, background: "#020617", mt: 3 }}>
      <Typography variant="h6" color="white" sx={{ mb: 2 }}>
        Per-User Risk Summary
      </Typography>

      <TableContainer sx={{ maxHeight: 260 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                "User",
                "Total Requests",
                "Blocked",
                "High-Risk / RBAC Blocks",
              ].map((h) => (
                <TableCell key={h} sx={{ color: "white", background: "#020617" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {userSummary.map((u) => (
              <TableRow key={u.userId}>
                <TableCell sx={{ color: "white" }}>{u.userId}</TableCell>
                <TableCell sx={{ color: "white" }}>{u.total}</TableCell>
                <TableCell sx={{ color: "white" }}>{u.blocked}</TableCell>
                <TableCell sx={{ color: "white" }}>{u.highRisk}</TableCell>
              </TableRow>
            ))}

            {userSummary.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{ color: "white", textAlign: "center" }}
                >
                  No user data yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
