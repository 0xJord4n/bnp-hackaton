import { harmonicService } from "@/lib/services/harmonic";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const size = parseInt(searchParams.get("size") || "5");

  if (!id) {
    return NextResponse.json(
      { error: "Company ID is required" },
      { status: 400 }
    );
  }

  try {
    const similarResponse = await harmonicService.getSimilarCompanies(id, size);

    if (similarResponse.error) {
      return NextResponse.json(
        { error: similarResponse.error.message },
        { status: similarResponse.error.status }
      );
    }

    if (!similarResponse.data) {
      return NextResponse.json({ error: "No data returned" }, { status: 404 });
    }

    // Fetch full details for each similar company
    const companyPromises = similarResponse.data.results.map((companyId) =>
      harmonicService.getCompanyById(companyId)
    );

    const companiesDetails = await Promise.all(companyPromises);
    const validCompanies = companiesDetails
      .filter((response) => !response.error && response.data)
      .map((response) => response.data);

    return NextResponse.json({ data: validCompanies, error: null });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch similar companies" },
      { status: 500 }
    );
  }
}
