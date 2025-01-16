import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { MarketInfo } from "../../api/search/route";

interface MarketInsightsCardProps {
  marketInfo: MarketInfo;
}

export function MarketInsightsCard({ marketInfo }: MarketInsightsCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Market Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Trends</h4>
            <ul className="space-y-2">
              {marketInfo.trends.map((trend, index) => (
                <li key={index} className="text-gray-300">
                  • {trend}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Challenges</h4>
            <ul className="space-y-2">
              {marketInfo.challenges.map((challenge, index) => (
                <li key={index} className="text-gray-300">
                  • {challenge}
                </li>
              ))}
            </ul>
          </div>
          {marketInfo.insights && marketInfo.insights.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-2">Key Insights</h4>
              <ul className="space-y-2">
                {marketInfo.insights.map((insight, index) => (
                  <li key={index} className="text-gray-300">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
