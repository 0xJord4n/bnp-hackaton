from .harmonic_api import (
    get_harmonic_company_id,
    get_company_details,
    get_harmonic_similar_companies,
    get_bulk_company_details,
)
from datetime import datetime, timedelta
from .similarity_prompt import Company, get_similar_competitors

def extract_required_fields(company_data):
    """
    Extract the required fields from the company data.
    """
    def safe_get(data, keys, default=None):
        for key in keys:
            if isinstance(data, dict):
                data = data.get(key, default)
            else:
                return default
        return data
    

    def extract_metrics(metrics, years=2):
        """
        Extract metrics from the last `years` years.
        """
        if not metrics:
            return []

        cutoff_date = datetime.utcnow() - timedelta(days=years * 365)
        filtered_metrics = []

        for metric in metrics:
            timestamp = metric.get("timestamp")
            if timestamp:
                metric_date = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
                if metric_date >= cutoff_date:
                    filtered_metrics.append({
                        "timestamp": timestamp,
                        "metric_value": metric.get("metric_value"),
                    })
        return filtered_metrics

    return  {
        "entity_urn": safe_get(company_data, ["entity_urn"]),
        "website_url": safe_get(company_data, ["website", "url"]),
        "website_domain": safe_get(company_data, ["website", "domain"]),
        "logo_url": company_data.get("logo_url"),
        "name": company_data.get("name"),
        "description": company_data.get("description"),
        "customer_type": company_data.get("customer_type"),
        "founding_date": safe_get(company_data, ["founding_date", "date"]),
        "address_formatted": safe_get(company_data, ["location", "address_formatted"]),
        "linkedin_url": safe_get(company_data, ["socials", "LINKEDIN", "url"]),
        "linkedin_follower_count": safe_get(company_data, ["socials", "LINKEDIN", "follower_count"]),
        "funding_total": safe_get(company_data, ["funding", "funding_total"]),
        "num_founding_rounds": safe_get(company_data, ["funding", "num_funding_rounds"]),
        "investors": [
            investor.get("name") for investor in safe_get(company_data, ["funding", "investors"], [])
        ],
        "last_funding_at": safe_get(company_data, ["funding", "last_funding_at"]),
        "last_funding_total": safe_get(company_data, ["funding", "last_funding_total"]),
        "funding_stage": safe_get(company_data, ["funding", "funding_stage"]),
        "linkedin_latest_metric_value": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "latest_metric_value"]),
        "linkedin_30d_ago_percent_change": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "30d_ago", "percent_change"]),
        "headcount_latest_metric_value": safe_get(company_data, ["traction_metrics", "headcount", "latest_metric_value"]),
        "headcount_30d_ago_value": safe_get(company_data, ["traction_metrics", "headcount", "30d_ago", "value"]),
        "headcount_30d_ago_percent_change": safe_get(company_data, ["traction_metrics", "headcount", "30d_ago", "percent_change"]),
        "web_traffic_latest_metric_value": safe_get(company_data, ["traction_metrics", "web_traffic", "latest_metric_value"]),
        "web_traffic_365d_ago_percent_change": safe_get(company_data, ["traction_metrics", "web_traffic", "365d_ago", "percent_change"]),
        "linkedin_metrics": extract_metrics(
            safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "metrics"])
        ),
        "headcount_metrics": extract_metrics(
            safe_get(company_data, ["traction_metrics", "headcount", "metrics"])
        ),
        "web_traffic_metrics": extract_metrics(
            safe_get(company_data, ["traction_metrics", "web_traffic", "metrics"])
        ),
    }

def process_main_company(domain):
    company_id = get_harmonic_company_id(domain)
    if not company_id:
        return {"error": "Company ID not found"}
    company_data = get_company_details(company_id)
    return extract_required_fields(company_data)

def process_similar_companies(domain):
    """
    Get and filter similar companies using OpenAI-based filtering.
    """
    # Step 1: Get the main company's Harmonic ID
    company_id = get_harmonic_company_id(domain)
    if not company_id:
        return {"error": "Company ID not found"}

    # Step 2: Fetch similar companies from Harmonic
    similar_company_urns = get_harmonic_similar_companies(company_id)
    similar_companies_data = get_bulk_company_details(similar_company_urns)

    # Step 3: Extract required fields for all competitors
    competitors = [extract_required_fields(company) for company in similar_companies_data]

    # Step 4: Create `Company` models for AI filtering
    main_company_data = get_company_details(company_id)
    main_company = Company(
        urn=main_company_data.get("entity_urn"),
        name=main_company_data.get("name"),
        description=main_company_data.get("description"),
        location=main_company_data.get("address_formatted"),
        founding_date=main_company_data.get("founding_date"),
        website_url=main_company_data.get("website_url"),
        funding_stage=main_company_data.get("funding_stage"),
        headcount_latest_metric_value=main_company_data.get("headcount_latest_metric_value"),
        linkedin_latest_metric_value=main_company_data.get("linkedin_latest_metric_value"),
    )
    competitor_models = [
        Company(
            urn=comp.get("entity_urn"), 
            name=comp.get("name"), 
            description=comp.get("description"),
            location=comp.get("location"),
            founding_date=comp.get("founding_date"),
            website_url=comp.get("website_url"),
            funding_stage=comp.get("funding_stage"),
            headcount_latest_metric_value=comp.get("headcount_latest_metric_value"),
            linkedin_latest_metric_value=comp.get("linkedin_latest_metric_value")
            )
        for comp in competitors
    ]

    # Convert models to dictionaries for JSON serialization
    formatted_main_company = main_company
    formatted_competitors = [comp for comp in competitor_models]

    # Step 5: Use OpenAI-based filtering to get the top 3-5 relevant competitors
    filtered_competitors = get_similar_competitors(
        formatted_main_company, formatted_competitors
    )

    # Step 6: Return detailed data of filtered competitors
    filtered_urns = filtered_competitors.company_urn
    filtered_companies_data = get_bulk_company_details(filtered_urns)

    return [extract_required_fields(company) for company in filtered_companies_data]
