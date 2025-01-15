import { SearchResponse } from "../api/search/route";
import { PerformanceCard } from "./cards/performance-card";
import { CompanyInfoCard } from "./cards/company-info-card";
import { SocialProfilesCard } from "./cards/social-profiles-card";

interface SearchResultsProps {
  results: SearchResponse;
}

export default function SearchResults({ results }: SearchResultsProps) {
  const { companyInfo, spiderData, socials } = results;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <CompanyInfoCard companyInfo={companyInfo} />
        <SocialProfilesCard socials={socials} />
      </div>
      <PerformanceCard spiderData={spiderData} />
    </div>
  );
}
