import useChainStatus from "../hooks/useChainStatus";
import useLogs from "../hooks/useLogs";
import useTrafficData from "../hooks/useTrafficData";

// UI components
import StatsCards from "../components/StatsCards";
import TrafficChart from "../components/TrafficChart";
import LiveFeed from "../components/LiveFeed";
import TrafficSimulator from "../components/TrafficSimulator";
import LogsTable from "../components/LogsTable";
import UserSummaryTable from "../components/UserSummaryTable";

// Traffic simulation function
import { simulateTraffic } from "../utils/simulateTraffic";

export default function DashboardPage() {
  const logs = useLogs();
  const { total, series } = useTrafficData();
  const chainOK = useChainStatus();

  const allowedCount = logs.filter(e => e.statusCode < 400).length;

  const highRiskCount = logs.filter(
    e =>
      e.decision?.label === "high_risk" ||
      e.decision?.label === "rbac_block"
  ).length;

  // Build user summary
  const userSummary = Object.values(
    logs.reduce((acc, entry) => {
      const user = entry.context?.userId || "unknown";

      if (!acc[user]) {
        acc[user] = { userId: user, total: 0, blocked: 0, highRisk: 0 };
      }

      acc[user].total++;
      if (entry.statusCode >= 400) acc[user].blocked++;
      if (
        entry.decision?.label === "high_risk" ||
        entry.decision?.label === "rbac_block"
      ) {
        acc[user].highRisk++;
      }

      return acc;
    }, {})
  );

  return (
    <>
      <StatsCards
        total={total}
        allowed={allowedCount}
        highRisk={highRiskCount}
        chainOK={chainOK}
      />

      <TrafficChart data={series} />

      <LiveFeed logs={logs} />

      <TrafficSimulator
        simulateNormalUserInfo={() =>
          simulateTraffic({
            path: "/info",
            userId: "user123",
            role: "user",
          })
        }
        simulateSuspiciousGuestAdmin={() =>
          simulateTraffic({
            path: "/admin/secret",
            userId: "guest01",
            role: "guest",
          })
        }
        simulateGuestAdminRBAC={() =>
          simulateTraffic({
            path: "/admin",
            userId: "guest01",
            role: "guest",
          })
        }
      />

      <LogsTable logs={logs} />

      <UserSummaryTable userSummary={userSummary} />
    </>
  );
}
