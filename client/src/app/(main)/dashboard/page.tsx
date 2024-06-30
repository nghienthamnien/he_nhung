"use client";

import { LineCharts } from "@/components/dashboard/LineCharts";

function Dashboard() {
  return (
    <div className="flex flex-col space-y-8 items-center">
      <LineCharts />
    </div>
  );
}

export default Dashboard;
