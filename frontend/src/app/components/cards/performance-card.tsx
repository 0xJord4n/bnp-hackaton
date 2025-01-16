import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { SpiderDataPoint } from "../../api/search/route";
import { LineChart } from "lucide-react";

interface PerformanceCardProps {
  spiderData: SpiderDataPoint[];
  marketAverageData?: SpiderDataPoint[];
}

const MemoizedRadarChart = React.memo(
  ({
    data,
    marketData,
  }: {
    data: SpiderDataPoint[];
    marketData?: SpiderDataPoint[];
  }) => {
    const combinedData = data.map((item, index) => ({
      category: item.category,
      company: item.value,
      market: marketData?.[index]?.value ?? 0,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="70%"
          data={combinedData}
          margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
        >
          <PolarGrid stroke="rgba(255,255,255,0.2)" />
          <PolarAngleAxis
            dataKey="category"
            stroke="rgba(255,255,255,0.8)"
            tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            domain={[0, 1]}
            tickCount={6}
            stroke="rgba(255,255,255,0.2)"
            tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 11 }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Radar
            name="Company"
            dataKey="company"
            stroke="rgba(147,51,234,1)"
            fill="rgba(147,51,234,0.3)"
            fillOpacity={0.6}
          />
          {marketData && (
            <Radar
              name="Market Average"
              dataKey="market"
              stroke="rgba(234,179,8,1)"
              fill="rgba(234,179,8,0.3)"
              fillOpacity={0.6}
            />
          )}
          <Legend
            wrapperStyle={{
              color: "white",
              paddingTop: "20px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  }
);

MemoizedRadarChart.displayName = "MemoizedRadarChart";

export function PerformanceCard({
  spiderData,
  marketAverageData,
}: PerformanceCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <LineChart className="w-5 h-5 mr-2" />
          {marketAverageData
            ? "Company Performance vs Market Average"
            : "Company Performance"}
        </CardTitle>
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
          <MemoizedRadarChart
            data={spiderData}
            marketData={marketAverageData}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
