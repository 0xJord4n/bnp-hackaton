import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const perplexity = createOpenAICompatible({
  name: "perplexity",
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai/",
});

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const { text } = await generateText({
    model: perplexity("llama-3.1-sonar-small-128k-online"),
    system: `
		You are a Venture Capital (VC) assistant specializing in market analysis. Your task is to analyze and summarize markets, trends, insights, companies, and challenges concisely. Focus exclusively on {company_domain_name} and its direct competitors. Do not include data about unrelated companies. Format your response strictly as a JSON object in one line:

{
  "marketExplanation": "Brief and clear explanation of the market where {company_domain_name} operates.",
  "marketSize": "Estimated total market size and growth rate (if available), only if it directly relates to {company_domain_name}.",
  "marketTrends": ["Key market trends relevant to {company_domain_name}."],
  "marketInsights": ["Deep insights into the market specifically regarding {company_domain_name}."],
  "marketChallenges": ["Major problems or obstacles in the market that directly impact {company_domain_name}."],
  "companyImpact": "What {company_domain_name} is bringing to the market (innovations, disruptions, new solutions, etc.).",
  "keyCompetitors": ["List of companies that are direct competitors of {company_domain_name}. Only include relevant competitors."],
  "fundingStatus": "Current funding stage of {company_domain_name} (e.g., Seed, Series A, Series B, etc.) and total amount raised if available.",
  "businessModel": "How {company_domain_name} generates revenue (e.g., SaaS, B2B, B2C, open-source monetization, etc.).",
  "targetCustomers": ["Types of customers or industries that {company_domain_name} is focusing on."],
  "news": {
    "content": "Summary of the latest relevant news about {company_domain_name}.",
    "author": "Author of the article or source.",
    "source": "Publication or platform name."
  }
}
	`.replace("{company_domain_name}", query),
    prompt:
      `Analyze the market where {company_domain_name} operates and provide structured insights. Format the response strictly as JSON in a single line (no line breaks or extra spaces). The JSON should contain:
- "marketExplanation": A concise explanation of the market.
- "marketSize": Estimated total market size and growth rate (if available).
- "marketTrends": A list of key trends shaping the market.
- "marketInsights": A list of deep insights into the market.
- "marketChallenges": A list of major problems or obstacles in the market.
- "companyImpact": A brief explanation of what {company_domain_name} is bringing to the market (innovations, disruptions, new solutions, etc.).
- "keyCompetitors": A list of the main competitors operating in the same space.
- "fundingStatus": The company’s current funding stage (e.g., Seed, Series A, Series B, etc.) and total amount raised (if available).
- "businessModel": A description of how {company_domain_name} generates revenue (e.g., SaaS, B2B, B2C, open-source monetization, etc.).
- "targetCustomers": A list of the primary customer segments or industries they are focusing on.
- "news": The latest news about {company_domain_name} with "content", "author", and "source".
Ensure accuracy, conciseness, and relevance.`.replace(
        "{company_domain_name}",
        query
      ),
    temperature: 0.2,
  });

  return NextResponse.json(JSON.parse(text));
}
