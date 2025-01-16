import { harmonicService } from "@/lib/services/harmonic";
import { HarmonicFounded, HarmonicFunding, HarmonicSocial } from "@/lib/types";
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
    const { data, error } = await harmonicService.getCompanyByUrl(url);

    if (error) {
      console.error("Error fetching company data:", error);
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No company data found" },
        { status: 404 }
      );
    }

    // Transform Harmonic data to match the expected frontend format
    const companyInfo: CompanyInfo = {
      name: data.name,
      description: data.description || "Description not available",
      website: data.website?.url || url,
      location: data.location?.address_formatted || "Location not available",
      industry: "Undefined", // This could be enhanced if Harmonic provides industry data
      founded: data.founded,
      logo_url: data.logo_url,
      stage: formatFundingStage(data.stage) || "Not available",
      customer_type: data.customer_type || "Not available",
      employees: data.headcount || "Not available",
    };

    // Fetch similar companies to use as competitors
    const similarResponse = await harmonicService.getSimilarCompanies(
      data.id,
      5
    );
    let competitors: Competitor[] = [];

    if (similarResponse.data && !similarResponse.error) {
      const companyPromises = similarResponse.data.results.map((companyId) =>
        harmonicService.getCompanyById(companyId)
      );

      const companiesDetails = await Promise.all(companyPromises);
      competitors = companiesDetails
        .filter((response) => !response.error && response.data)
        .map((response) => ({
          name: response.data!.name,
          website: response.data!.website?.url || "",
        }));
    }

    // Generate two distinct spider datasets for visualization
    const categories = [
      "Traffic",
      "Headcount",
      "Funding",
      "Linkedin Followers",
    ];

    const spiderData = categories.map((category) => ({
      category,
      value: Number((0.3 + Math.random() * 0.7).toFixed(2)), // Values between 0.3 and 1.0
    }));

    const marketAverageData = categories.map((category) => ({
      category,
      value: Number((0.2 + Math.random() * 0.6).toFixed(2)), // Values between 0.2 and 0.8
    }));

    // Generate competitor comparison data
    const generateTimeSeriesData = (baseValue: number, volatility: number) => {
      const months = 12;
      const data = [];
      let currentValue = baseValue;

      for (let i = 0; i < months; i++) {
        const date = new Date(2023, i, 1);
        const change = (Math.random() - 0.5) * 2 * volatility;
        currentValue = Math.max(0, currentValue + change);
        data.push({
          date: date.toISOString().slice(0, 7),
          value: Number(currentValue.toFixed(2)),
        });
      }
      return data;
    };

    const generateRandomColor = () => {
      const hue = Math.floor(Math.random() * 360);
      const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
      const lightness = Math.floor(Math.random() * 20) + 45; // 45-65%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // Create competitor comparison data using real competitors
    const competitorComparison: CompetitorData[] = [
      {
        name: companyInfo.name,
        location: companyInfo.location,
        funding: 50000000,
        followers: generateTimeSeriesData(50000, 5000),
        headcount: generateTimeSeriesData(500, 20),
        traffic: generateTimeSeriesData(1000000, 100000),
        marketShare: generateTimeSeriesData(0.35, 0.02),
        growthRate: generateTimeSeriesData(0.25, 0.03),
        color: "hsl(var(--chart-1))", // Main company uses primary chart color
      },
      ...competitors.slice(0, 4).map((competitor, index) => {
        const multipliers = [0.7, 1.5, 0.5, 0.8]; // Different sizes for variety
        const baseMultiplier = multipliers[index];

        return {
          name: competitor.name,
          location: "Global", // We don't have location in the competitor data
          funding: 50000000 * baseMultiplier,
          followers: generateTimeSeriesData(
            50000 * baseMultiplier,
            5000 * baseMultiplier
          ),
          headcount: generateTimeSeriesData(
            500 * baseMultiplier,
            20 * baseMultiplier
          ),
          traffic: generateTimeSeriesData(
            1000000 * baseMultiplier,
            100000 * baseMultiplier
          ),
          marketShare: generateTimeSeriesData(0.35 * baseMultiplier, 0.02),
          growthRate: generateTimeSeriesData(0.25 * (1 / baseMultiplier), 0.03), // Inverse relationship for growth
          color: generateRandomColor(),
        };
      }),
    ];

    // Fetch market insights from Perplexity API
    const perplexityResponse = await fetch(
      `http://localhost:3000/api/perplexity?query=${encodeURIComponent(url)}`
    );

    if (!perplexityResponse.ok) {
      console.error(
        "Error fetching from Perplexity API:",
        await perplexityResponse.text()
      );
      throw new Error("Failed to fetch market insights");
    }

    const perplexityData = await perplexityResponse.json();

    // Transform Perplexity data to match MarketInfo interface
    const marketInfo: MarketInfo = {
      trends: perplexityData.marketTrends || [],
      challenges: perplexityData.marketChallenges || [],
      size: perplexityData.marketSize || "Market size not available",
      growth_rate: perplexityData.marketGrowth || "Growth rate not available",
      insights: perplexityData.marketInsights || [],
    };

    return NextResponse.json({
      companyInfo,
      spiderData,
      marketAverageData,
      socials: Object.entries(data.socials).map(([key, value]) => ({
        platform: key,
        url: value.url,
      })),
      funding: data.funding,
      competitors,
      marketInfo,
      competitorComparison,
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { error: "Failed to fetch company data" },
      { status: 500 }
    );
  }
}
