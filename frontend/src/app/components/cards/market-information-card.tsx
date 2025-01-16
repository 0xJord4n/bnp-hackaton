import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { MarketInfo } from "../../api/search/route";

interface MarketInformationCardProps {
  marketInfo: MarketInfo;
}

export function MarketInformationCard({
  marketInfo,
}: MarketInformationCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Market Information
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <dl className="space-y-2 text-sm">
          {marketInfo.size && (
            <div className="flex">
              <dt className="w-1/2 font-medium text-gray-400">Market Size:</dt>
              <dd className="w-1/2 text-white">{marketInfo.size}</dd>
            </div>
          )}
          {marketInfo.growth_rate && (
            <div className="flex">
              <dt className="w-1/2 font-medium text-gray-400">Growth Rate:</dt>
              <dd className="w-1/2 text-white">{marketInfo.growth_rate}</dd>
            </div>
          )}
        </dl>
        {marketInfo.insights && marketInfo.insights.length > 0 && (
          <div className="mt-4">
            <h4 className="text-white font-medium mb-2">Key Insights:</h4>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {marketInfo.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
