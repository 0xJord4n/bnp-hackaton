import { SearchResponse } from "../api/search/route";
import { PerformanceCard } from "./cards/performance-card";
import { CompanyInfoCard } from "./cards/company-info-card";
import { SocialProfilesCard } from "./cards/social-profiles-card";
import { FundingCard } from "./cards/funding-card";
import { CompanyProfile } from "./company-profile";

interface SearchResultsProps {
  results: SearchResponse;
}

export default function SearchResults({ results }: SearchResultsProps) {
  const { companyInfo, spiderData, socials, funding } = results;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12 flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex items-center justify-center">
          <CompanyProfile
            name={companyInfo.name}
            logoUrl={companyInfo.logo_url}
          />
        </div>
        <PerformanceCard spiderData={spiderData} />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <CompanyInfoCard companyInfo={companyInfo} />
        <SocialProfilesCard socials={socials} />
        {funding && <FundingCard funding={funding} />}
      </div>
    </div>
  );
}
