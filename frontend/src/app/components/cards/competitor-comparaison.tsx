"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";

interface TimeSeriesData {
  date: string;
  value: number;
}

export interface CompetitorData {
  name: string;
  location: string;
  funding: number;
  followers?: TimeSeriesData[];
  headcount?: TimeSeriesData[];
  traffic?: TimeSeriesData[];
  marketShare?: TimeSeriesData[];
  growthRate?: TimeSeriesData[];
  color?: string;
}

interface CompetitorComparisonProps {
  data: CompetitorData[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
};

const getMostRecentValue = (data: TimeSeriesData[] | undefined) => {
  return data && data.length > 0 ? data[data.length - 1].value : 0;
};

export default function CompetitorComparison({
  data,
}: CompetitorComparisonProps) {
  const companyColors = Object.fromEntries(
    data.map((company) => [
      company.name,
      company.color || `hsl(var(--chart-1))`,
    ])
  );

  const formatFollowers = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const formatHeadcount = (value: number) => {
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const formatTraffic = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const formatDate = (date: string) => {
    const [year, month] = date.split("-");
    return `${
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][parseInt(month) - 1]
    } ${year}`;
  };

  const renderLineChart = (
    dataKey: string,
    yAxisFormatter: (value: number) => string,
    label: string
  ) => {
    const chartData =
      (data[0][dataKey as keyof CompetitorData] as TimeSeriesData[]) || [];
    const mergedData = chartData.map((item) => {
      const mergedItem: { [key: string]: any } = { date: item.date };
      data.forEach((company) => {
        const companyData =
          (company[dataKey as keyof CompetitorData] as TimeSeriesData[]) || [];
        const matchingItem = companyData.find((d) => d.date === item.date);
        if (matchingItem) {
          mergedItem[company.name] = matchingItem.value;
        }
      });
      return mergedItem;
    });

    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <ChartContainer
          config={Object.fromEntries(
            data.map((company) => [
              company.name,
              { label: company.name, color: companyColors[company.name] },
            ])
          )}
          className="h-[300px] mx-auto"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mergedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="date" stroke="#fff" tickFormatter={formatDate} />
              <YAxis stroke="#fff" tickFormatter={yAxisFormatter} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {data.map((company) => (
                <Line
                  key={company.name}
                  type="monotone"
                  dataKey={company.name}
                  name={company.name}
                  stroke={companyColors[company.name]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: companyColors[company.name] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.map((company) => (
            <div key={company.name} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: companyColors[company.name] }}
              />
              <span className="text-sm text-gray-300">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const router = useRouter();

  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader>
        <CardTitle className="text-white">Competitor Comparison</CardTitle>
        <CardDescription className="text-gray-400">
          Key performance indicators across major competitors
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Company Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Funding
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Headcount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Traffic
                    </th>
                    <th scope="col" className="px-6 py-3">
                      LinkedIn Followers
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((company, index) => (
                    <tr
                      key={company.name}
                      className="border-b bg-gray-800 border-gray-700"
                    >
                      <th
                        scope="row"
                        className={`px-6 py-4 font-medium whitespace-nowrap ${
                          index === 0 ? "text-white underline" : "text-gray-300"
                        }`}
                      >
                        <button
                          onClick={() =>
                            router.push(
                              `/?url=${encodeURIComponent(
                                company.name.toLowerCase() + ".com"
                              )}`
                            )
                          }
                          className="hover:text-purple-400 transition-colors"
                        >
                          {company.name}
                        </button>
                      </th>
                      <td className="px-6 py-4">{company.location}</td>
                      <td className="px-6 py-4">
                        {formatCurrency(company.funding)}
                      </td>
                      <td className="px-6 py-4">
                        {formatNumber(
                          getMostRecentValue(company.headcount || [])
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {formatNumber(
                          getMostRecentValue(company.traffic || [])
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {formatNumber(
                          getMostRecentValue(company.followers || [])
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              LinkedIn Followers
            </h3>
            {renderLineChart(
              "followers",
              formatFollowers,
              "LinkedIn Followers"
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Headcount</h3>
            {renderLineChart("headcount", formatHeadcount, "Headcount")}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Website Traffic
            </h3>
            {renderLineChart(
              "traffic",
              formatTraffic,
              "Monthly Website Visitors"
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Market Share
            </h3>
            {renderLineChart(
              "marketShare",
              formatPercentage,
              "Market Share (%)"
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Growth Rate
            </h3>
            {renderLineChart("growthRate", formatPercentage, "Growth Rate (%)")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
