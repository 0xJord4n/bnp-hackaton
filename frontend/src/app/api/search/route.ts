import { NextResponse } from "next/server";

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
    // In a real application, you would fetch this data from an external API or database
    // This is a mock implementation for demonstration purposes
    const companyInfo = {
      name: `${
        url.split(".")[0].charAt(0).toUpperCase() + url.split(".")[0].slice(1)
      } Inc.`,
      description: "A leading technology company",
      founded: "2005",
      employees: "1000-5000",
      industry: "Software",
      website: url,
    };

    const socialProfiles = [
      { platform: "Twitter", handle: `@${url.split(".")[0]}` },
      { platform: "LinkedIn", handle: `${url.split(".")[0]}-company` },
      { platform: "Facebook", handle: `${url.split(".")[0]}official` },
    ];

    return NextResponse.json({ companyInfo, socialProfiles });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { error: "Failed to fetch company data" },
      { status: 500 }
    );
  }
}
