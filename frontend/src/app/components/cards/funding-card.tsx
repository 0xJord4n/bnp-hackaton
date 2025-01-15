import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency,
  formatDate,
  formatFundingStage,
} from "@/lib/utils/format";

interface Investor {
  name: string;
}

interface FundingInfo {
  funding_total: number;
  num_funding_rounds: number;
  last_funding_at: string;
  last_funding_type: string | null;
  last_funding_total: number;
  funding_stage: string | null;
  investors: Investor[];
}

interface FundingCardProps {
  funding: FundingInfo;
}

export function FundingCard({ funding }: FundingCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <CardHeader>
        <CardTitle className="text-white">Funding Information</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <dl className="space-y-2 text-sm">
          <div className="flex">
            <dt className="w-1/2 font-medium text-gray-400">Total Funding:</dt>
            <dd className="w-1/2 text-white">
              {formatCurrency(funding.funding_total)}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-1/2 font-medium text-gray-400">Funding Rounds:</dt>
            <dd className="w-1/2 text-white">{funding.num_funding_rounds}</dd>
          </div>
          <div className="flex">
            <dt className="w-1/2 font-medium text-gray-400">
              Last Funding Date:
            </dt>
            <dd className="w-1/2 text-white">
              {formatDate(funding.last_funding_at)}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-1/2 font-medium text-gray-400">
              Last Funding Type:
            </dt>
            <dd className="w-1/2 text-white">
              {formatFundingStage(funding.last_funding_type)}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-1/2 font-medium text-gray-400">
              Last Funding Amount:
            </dt>
            <dd className="w-1/2 text-white">
              {formatCurrency(funding.last_funding_total)}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-1/2 font-medium text-gray-400">Funding Stage:</dt>
            <dd className="w-1/2 text-white">
              {formatFundingStage(funding.funding_stage)}
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
