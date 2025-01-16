import { HarmonicFounded, HarmonicFunding } from "@/lib/types";
import { formatFundingStage } from "@/lib/utils/format";
import { NextResponse } from "next/server";

export interface SocialProfile {
  platform: string;
  url: string;
}

export interface SpiderDataPoint {
  category: string;
  value: number;
}

export interface Competitor {
  name: string;
  website: string;
}

export interface CompetitorTimeSeriesData {
  date: string;
  value: number;
}

export interface CompetitorData {
  name: string;
  location: string;
  funding: number;
  followers?: CompetitorTimeSeriesData[];
  headcount?: CompetitorTimeSeriesData[];
  traffic?: CompetitorTimeSeriesData[];
  marketShare?: CompetitorTimeSeriesData[];
  growthRate?: CompetitorTimeSeriesData[];
  color?: string;
}

export interface MarketInfo {
  trends: string[];
  challenges: string[];
  size?: string;
  growth_rate?: string;
  insights?: string[];
}

export interface CompanyInfo {
  name: string;
  description: string;
  website: string;
  location: string;
  industry: string;
  customer_type: string;
  logo_url: string;
  employees: string | number;
  stage: string;
  founded: HarmonicFounded;
}

export interface SearchResponse {
  companyInfo: CompanyInfo;
  spiderData: SpiderDataPoint[];
  marketAverageData: SpiderDataPoint[];
  socials: SocialProfile[];
  funding: HarmonicFunding;
  competitors: Competitor[];
  marketInfo: MarketInfo;
  competitorComparison: CompetitorData[];
}

interface CompetitorResponse {
  name: string;
  website_url?: string;
  address_formatted?: string;
  funding_total?: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Get main company data
    const mainCompanyResponse = await fetch(
      "http://localhost:8000/competitors/main/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: "https://"+url  }),
      }
    );
    const mainCompanyData = await mainCompanyResponse.json();

    // Get competitors list
    const competitorsResponse = await fetch(
      "http://localhost:8000/competitors/list/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: "https://"+url  }),
      }
    );
    const competitorsList = await competitorsResponse.json();

    console.log(competitorsList)
    // Get scoring data
    const scoringResponse = await fetch(
      "http://localhost:8000/competitors/scoring/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: "https://"+url }),
      }
    );
    const scoringData = await scoringResponse.json();

    // Transform main company data to match CompanyInfo interface
    const companyInfo: CompanyInfo = {
      name: mainCompanyData.name,
      description: mainCompanyData.description || "Description not available",
      website: mainCompanyData.website_url || url,
      location: mainCompanyData.address_formatted || "Location not available",
      industry: "Technology", // Default to Technology as it's not provided by Harmonic
      logo_url: mainCompanyData.logo_url,
      stage:
        formatFundingStage(mainCompanyData.funding_stage) || "Not available",
      customer_type: mainCompanyData.customer_type || "Not available",
      employees: mainCompanyData.corrected_headcount || "Not available",
      founded: {
        date: mainCompanyData.founding_date || null,
        granularity: "YEAR", // Default to YEAR since we get YYYY-MM-DD from the backend
      },
    };

    // Transform competitors data
    const competitors: Competitor[] = competitorsList.map(
      (comp: CompetitorResponse) => ({
        name: comp.name,
        website: comp.website_url || "",
      })
    );

    // Transform spider data from scoring
    const spiderData: SpiderDataPoint[] = [
      {
        category: "Traffic",
        value: scoringData.market_scores.market_average_scaled_web_traffic,
      },
      {
        category: "Headcount",
        value: scoringData.market_scores.market_average_scaled_headcount,
      },
      {
        category: "Funding",
        value: scoringData.market_scores.market_average_scaled_funding,
      },
      {
        category: "Linkedin Followers",
        value: scoringData.market_scores.market_average_scaled_linkedin,
      },
    ];

    const marketAverageData: SpiderDataPoint[] = [
      {
        category: "Traffic",
        value: scoringData.market_scores.market_average_scaled_web_traffic,
      },
      {
        category: "Headcount",
        value: scoringData.market_scores.market_average_scaled_headcount,
      },
      {
        category: "Funding",
        value: scoringData.market_scores.market_average_scaled_funding,
      },
      {
        category: "Linkedin Followers",
        value: scoringData.market_scores.market_average_scaled_linkedin,
      },
    ];

    // Transform competitor comparison data
    const competitorComparison: CompetitorData[] = [
      {
        name: companyInfo.name,
        location: companyInfo.location,
        funding: mainCompanyData.funding_total || 0,
        color: "hsl(var(--chart-1))", // Main company uses primary chart color
      },
      ...competitorsList
        .slice(0, 4)
        .map((competitor: CompetitorResponse, index: number) => ({
          name: competitor.name,
          location: competitor.address_formatted || "Global",
          funding: competitor.funding_total || 0,
          color: `hsl(${120 + index * 60}, 70%, 50%)`, // Generate distinct colors
        })),
    ];

    // Fetch market insights from Perplexity API
    const perplexityResponse = await fetch(
      `http://localhost:3000/api/perplexity?query=${encodeURIComponent(url)}`
    );

    let marketInfo: MarketInfo = {
      trends: [],
      challenges: [],
      size: "Market size not available",
      growth_rate: "Growth rate not available",
      insights: [],
    };

    if (perplexityResponse.ok) {
      const perplexityData = await perplexityResponse.json();
      marketInfo = {
        trends: perplexityData.marketTrends || [],
        challenges: perplexityData.marketChallenges || [],
        size: perplexityData.marketSize || "Market size not available",
        growth_rate: perplexityData.marketGrowth || "Growth rate not available",
        insights: perplexityData.marketInsights || [],
      };
    }

    // Transform social profiles
    const socials: SocialProfile[] = mainCompanyData.linkedin_url
      ? [
          {
            platform: "linkedin",
            url: mainCompanyData.linkedin_url,
          },
        ]
      : [];

    // Transform funding data
    const funding: HarmonicFunding = {
      funding_total: mainCompanyData.funding_total || 0,
      num_funding_rounds: mainCompanyData.num_founding_rounds || 0,
      investors:
        mainCompanyData.investors?.map((investor: string) => ({
          entity_urn: "",
          name: investor,
        })) || [],
      last_funding_at: mainCompanyData.last_funding_at || "",
      last_funding_type: "",
      last_funding_total: mainCompanyData.last_funding_total || 0,
      funding_stage: mainCompanyData.funding_stage || "",
    };

    return NextResponse.json({
      companyInfo,
      spiderData,
      marketAverageData,
      socials,
      funding,
      competitors,
      marketInfo,
      competitorComparison,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
