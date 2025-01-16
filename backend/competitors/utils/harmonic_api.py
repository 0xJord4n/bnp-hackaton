
import requests
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

HARMONIC_API_KEY = os.getenv("HARMONIC_API_KEY")

def get_harmonic_company_id(domain):
    api_url = f"https://api.harmonic.ai/companies?website_url={domain}"
    headers = {"apikey": HARMONIC_API_KEY}
    response = requests.post(api_url, headers=headers)
    if response.status_code == 200:
        return response.json().get("id")
    return None

def get_company_details(company_id):
    api_url = f"https://api.harmonic.ai/companies/{company_id}"
    headers = {"apikey": HARMONIC_API_KEY}
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    return None

def get_harmonic_similar_companies(company_id):
    api_url = f"https://api.harmonic.ai/search/similar_companies/{company_id}?size=20"
    headers = {"apikey": HARMONIC_API_KEY}
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        return response.json().get("results", [])
    return []

def get_bulk_company_details(company_urns):
    url = "https://api.harmonic.ai/companies/batchGet"
    headers = {"apikey": HARMONIC_API_KEY}
    response = requests.post(url, json={"urns": company_urns}, headers=headers)
    if response.status_code == 200:
        return response.json()
    return []
