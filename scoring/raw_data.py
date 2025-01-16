# Function to get the company ID from Harmonic API
import requests
import os
HARMONIC_API_KEY = os.environ.get('HARMONIC_API')
def get_harmonic_company_id(domain):
    api_url = f"https://api.harmonic.ai/companies?website_url={domain}"
    headers = {"apikey": f"{HARMONIC_API_KEY}"}
    response = requests.post(api_url, headers=headers)
    if response.status_code == 200:
        company_data = response.json()
        return company_data.get("id")
    return None
def get_company_details(company_id):
    api_url = f"https://api.harmonic.ai/companies/{company_id}"
    headers = {"apikey": f"{HARMONIC_API_KEY}"}
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    return {"error": response.json()}
# Function to get similar companies using the company ID or URN
def get_harmonic_similar_companies(company_id):
    if not company_id:
        return []
    api_url = f"https://api.harmonic.ai/search/similar_companies/{company_id}?size=20"
    headers = {"apikey": f"{HARMONIC_API_KEY}"}
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        return response.json().get("results", [])
    return []
def get_bulk_company_details(company_urns):
    print(f"urns are: {company_urns}")
    url = "https://api.harmonic.ai/companies/batchGet"
    body = {
        "urns": company_urns
    }
    print(url)
    headers = {"apikey": HARMONIC_API_KEY}
    response = requests.post(url, json=body, headers=headers)
    if response.status_code == 200:
        return response.json()
    return []
# def extract_required_fields(company_data):
#     required_fields = [
#         "name"
#     ]
#     extracted_data = {key: company_data.get(key) for key in required_fields if key in company_data}
#     return extracted_data
def extract_required_fields(company_data):
    """
    Extract only the required fields from the company data.
    """
    def safe_get(data, keys, default=None):
        """
        Safely get a nested value from a dictionary.
        """
        for key in keys:
            if isinstance(data, dict):
                data = data.get(key, default)
            else:
                return default
        return data
    extracted_data = {
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
        "corrected_headcount": company_data.get("corrected_headcount"),
        "linkedin_30d_ago_value": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "30d_ago", "value"]),
        "linkedin_30d_ago_change": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "30d_ago", "change"]),
        "linkedin_30d_ago_percent_change": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "30d_ago", "percent_change"]),
        "linkedin_365d_ago_value": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "365d_ago", "value"]),
        "linkedin_365d_ago_change": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "365d_ago", "change"]),
        "linkedin_365d_ago_percent_change": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "365d_ago", "percent_change"]),
        "linkedin_latest_metric_value": safe_get(company_data, ["traction_metrics", "linkedin_follower_count", "latest_metric_value"]),
        "headcount_30d_ago_value": safe_get(company_data, ["traction_metrics", "headcount", "30d_ago", "value"]),
        "headcount_30d_ago_change": safe_get(company_data, ["traction_metrics", "headcount", "30d_ago", "change"]),
        "headcount_30d_ago_percent_change": safe_get(company_data, ["traction_metrics", "headcount", "30d_ago", "percent_change"]),
        "headcount_365d_ago_value": safe_get(company_data, ["traction_metrics", "headcount", "365d_ago", "value"]),
        "headcount_365d_ago_change": safe_get(company_data, ["traction_metrics", "headcount", "365d_ago", "change"]),
        "headcount_365d_ago_percent_change": safe_get(company_data, ["traction_metrics", "headcount", "365d_ago", "percent_change"]),
        "headcount_latest_metric_value": safe_get(company_data, ["traction_metrics", "headcount", "latest_metric_value"]),
        "web_traffic_365d_ago_value": safe_get(company_data, ["traction_metrics", "web_traffic", "365d_ago", "value"]),
        "web_traffic_365d_ago_change": safe_get(company_data, ["traction_metrics", "web_traffic", "365d_ago", "change"]),
        "web_traffic_365d_ago_percent_change": safe_get(company_data, ["traction_metrics", "web_traffic", "365d_ago", "percent_change"]),
        "web_traffic_latest_metric_value": safe_get(company_data, ["traction_metrics", "web_traffic", "latest_metric_value"]),
    }
    return extracted_data
# Full workflow
def process_company(domain):
    company_id = get_harmonic_company_id(domain)
    if not company_id:
        return {"error": "Company ID not found"}
    company_data = get_company_details(company_id)
    similar_company_ids = get_harmonic_similar_companies(company_id)
    similar_companies_data = get_bulk_company_details(similar_company_ids)
    # Extract required fields for all companies
    result = {
        "main_company": extract_required_fields(company_data),
        "similar_companies": [extract_required_fields(comp) for comp in similar_companies_data],
    }
    return result