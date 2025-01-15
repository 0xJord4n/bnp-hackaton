import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { SpiderDataPoint } from "../../api/search/route";

interface PerformanceCardProps {
  spiderData: SpiderDataPoint[];
}

const MemoizedRadarChart = React.memo(
  ({ data }: { data: SpiderDataPoint[] }) => (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.2)" />
        <PolarAngleAxis
          dataKey="category"
          stroke="rgba(255,255,255,0.8)"
          tick={{ fill: "rgba(255,255,255,0.8)" }}
        />
        <PolarRadiusAxis
          stroke="rgba(255,255,255,0.2)"
          tick={{ fill: "rgba(255,255,255,0.8)" }}
        />
        <Radar
          name="Value"
          dataKey="value"
          stroke="rgba(147,51,234,0.9)"
          fill="rgba(147,51,234,0.3)"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
);

MemoizedRadarChart.displayName = "MemoizedRadarChart";

export function PerformanceCard({ spiderData }: PerformanceCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <CardHeader>
        <CardTitle className="text-white">Company Performance</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <ChartContainer
          config={{
            value: {
              label: "Value",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <MemoizedRadarChart data={spiderData} />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
