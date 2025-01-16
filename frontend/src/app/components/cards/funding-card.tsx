import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HarmonicFunding } from "@/lib/types";
import { DollarSign } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  formatFundingStage,
} from "@/lib/utils/format";

interface FundingCardProps {
  funding: HarmonicFunding;
}

export function FundingCard({ funding }: FundingCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Funding Information
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <dl className="space-y-2 text-sm">
          <div className="flex">
            <dt className="w-1/3 font-medium text-gray-400">Total Funding:</dt>
            <dd className="w-2/3 text-white">
              {formatCurrency(funding.funding_total)}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-1/3 font-medium text-gray-400">Funding Rounds:</dt>
            <dd className="w-2/3 text-white">{funding.num_funding_rounds}</dd>
          </div>
          <div className="flex">
            <dt className="w-1/3 font-medium text-gray-400">Last Funding:</dt>
            <dd className="w-2/3 text-white">
              {funding.last_funding_at
                ? formatDate(funding.last_funding_at)
                : "N/A"}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-1/3 font-medium text-gray-400">Stage:</dt>
            <dd className="w-2/3 text-white">
              {formatFundingStage(funding.funding_stage) || "N/A"}
            </dd>
          </div>
        </dl>
        {funding.investors && funding.investors.length > 0 && (
          <div className="mt-4">
            <h4 className="text-white font-medium mb-2">Top Investors:</h4>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {funding.investors.slice(0, 5).map((investor, index) => (
                <li key={index}>{investor.name}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
