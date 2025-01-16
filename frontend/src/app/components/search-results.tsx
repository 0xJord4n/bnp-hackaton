import { SearchResponse } from "../api/search/route";
import { PerformanceCard } from "./cards/performance-card";
import { CompanyInfoCard } from "./cards/company-info-card";
import { FundingCard } from "./cards/funding-card";
import { MarketInsightsCard } from "./cards/market-insights-card";
import { ExportButton } from "./export-button";
import CompetitorComparison from "./cards/competitor-comparaison";

interface SearchResultsProps {
  results: SearchResponse;
}

export default function SearchResults({ results }: SearchResultsProps) {
  const {
    companyInfo,
    spiderData,
    socials,
    funding,
    competitorComparison,
    marketInfo,
  } = results;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12 flex flex-col gap-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{companyInfo.name}</h1>
        <ExportButton />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CompanyInfoCard companyInfo={companyInfo} socials={socials} />
        {funding && <FundingCard funding={funding} />}

        <PerformanceCard spiderData={spiderData} />
        {marketInfo && <MarketInsightsCard marketInfo={marketInfo} />}
      </div>
      {competitorComparison && competitorComparison.length > 0 && (
        <CompetitorComparison data={competitorComparison} />
      )}
    </div>
  );
}
