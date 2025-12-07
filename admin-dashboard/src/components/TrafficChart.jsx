import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { Box, Typography } from "@mui/material";
import CustomTooltip from "./CustomTooltip";

export default function TrafficChart({ data }) {
  return (
    <Box sx={{ p: 2, background: "#020617", mb: 3 }}>
      <Typography variant="h6" color="white" gutterBottom>
        Real-Time Traffic Rate (Reqs/Second)
      </Typography>

      <Box sx={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="time"
              tickFormatter={(t) => new Date(t).toLocaleTimeString()}
              stroke="#9ca3af"
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
