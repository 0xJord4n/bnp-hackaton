import { harmonicService } from "@/lib/services/harmonic";
import { HarmonicSocial } from "@/lib/types";
import { NextResponse } from "next/server";

export interface SocialProfile {
  platform: string;
  url: string;
}

export interface SpiderDataPoint {
  category: string;
  value: number;
}

export interface CompanyInfo {
  name: string;
  description: string;
  website: string;
  location: string;
  industry: string;
  socials: SocialProfile[];
  employees: string | number;
}

export interface SearchResponse {
  companyInfo: CompanyInfo;
  spiderData: SpiderDataPoint[];
  socials: SocialProfile[];
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
    const companyInfo = {
      name: data.name,
      description: data.description || "Description not available",
      website: data.website?.url || url,
      location: data.location?.address_formatted || "Location not available",
      industry: "Technology", // This could be enhanced if Harmonic provides industry data
      employees: data.headcount || "Not available", // This could be enhanced if Harmonic provides employee count
    };

    // Mock spider data for visualization
    // This could be enhanced with real metrics if Harmonic provides them
    const spiderData = [
      { category: "Funding", value: Math.floor(Math.random() * 100) },
      { category: "HR", value: Math.floor(Math.random() * 100) },
      { category: "Growth", value: Math.floor(Math.random() * 100) },
      { category: "Innovation", value: Math.floor(Math.random() * 100) },
      { category: "Market Share", value: Math.floor(Math.random() * 100) },
    ];

    return NextResponse.json({
      companyInfo,
      spiderData,
      socials: Object.entries(data.socials).map(([key, value]) => ({
        platform: key,
        url: value.url,
      })),
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { error: "Failed to fetch company data" },
      { status: 500 }
    );
  }
}
