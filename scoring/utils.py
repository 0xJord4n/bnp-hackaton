import requests
import os

from rich import print
from tqdm import tqdm
from pydantic import BaseModel

from typing_extensions import List, TypedDict

from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage

from raw_data import process_company

if not os.environ.get("HARMONIC_API"):
    print("no harmonic api")
    exit()
else:
    HARMONIC_API_KEY = os.environ.get('HARMONIC_API')
base_url = 'https://predictleads.com/api/v3'
api_key = os.environ.get("PL_API_KEY")
token = os.environ.get('PL_TOKEN')
pl_headers = {'X-Api-Key': api_key, 'X-Api-Token': token}

def get_news(domain, headers=pl_headers):
  # Positive Sentiment
  positive_sentiment = [
      "acquires", "merges_with", "signs_new_client", "expands_facilities", "expands_offices_in", "expands_offices_to", "opens_new_location",
      "increases_headcount_by", "goes_public", "invests_into", "invests_into_assets", "receives_financing", "hires", "promotes",
      "integrates_with", "is_developing", "launches", "partners_with", "receives_award", "recognized_as"
  ]
  # Negative Sentiment
  negative_sentiment = [ "files_suit_against", "has_issues_with", "closes_offices_in", "decreases_headcount_by", "leaves", "retires_from" ]
  news = requests.get(f'{base_url}/companies/{domain}/news_events', headers=headers, params={"found_at_from": "2024-09-01"})
  news = news.json()['data']
  positive_news = [elem['attributes']['summary'] for elem in news if elem['attributes']['category'] in positive_sentiment]
  negative_news = [elem['attributes']['summary'] for elem in news if elem['attributes']['category'] in negative_sentiment]
  return positive_news, negative_news

def getQuantitativeData(full_data):
  full_data_list = [full_data["main_company"]] + full_data["similar_companies"]
  data_to_get = {'funding':'funding_total', 'linkedin': 'linkedin_latest_metric_value', 'headcount': 'headcount_latest_metric_value', 'web_traffic': 'web_traffic_latest_metric_value', 'likedin_growth': 'linkedin_30d_ago_percent_change', 'headcount_growth': 'headcount_30d_ago_percent_change', 'web_traffic_growth': 'web_traffic_365d_ago_percent_change'}
  data = []
  for elem in full_data_list:
    data.append({})
    for key in data_to_get.keys():
      data[-1][key] = elem[data_to_get[key]]
  return data

def newsEventsScoring(list_of_companies):
  llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
  system_message = SystemMessage(content="""
You are an expert in startup analysis. Based on the news events, provide sentiment scores for each startup. Score each startup on a scale of -1 (very negative) to +1 (very positive)
Consider all startups in the context of the group when scoring.
Provide a python list of scores in the output with respecting the input order and the number of the startups.
""")
  class ModelOutput(BaseModel):
    scores: List[float]
  llm_with_parser = llm.with_structured_output(ModelOutput)
  human_message = """
Analyze the companies' news events:
{companies_data}
"""
  news = []
  for company in list_of_companies:
    positive_news, negative_news = get_news(company)
    positive_news_template = "Positive news events:\n"
    negative_news_template = "Negative news events:\n"
    for elem in positive_news:
      positive_news_template += f"\t- {elem}\n"
    for elem in negative_news:
      negative_news_template += f"\t- {elem}\n"

    news.append(f"""
    Company: {company}
    {positive_news_template}
    {negative_news_template}
    """)
  human_message = human_message.format(companies_data="\n".join(news))
  messages = [system_message, HumanMessage(content=human_message)]
  llm_response = llm_with_parser.invoke(messages)
  return llm_response.scores
def scale(scores):
  min_value = min(scores)
  max_value = max(scores)
  return [(value - min_value) / (max_value - min_value) for value in scores]
def quantitativeDataScoring(companies_data, list_of_companies):
  final_data = [{"website_url": company} for company in list_of_companies]
  keys = list(companies_data[0].keys()).copy()
  for key in keys:
    scores = []
    for company in companies_data:
      if company[key] is None:
        company[key] = 0
      scores.append(company[key])
    scores = scale(scores)
    for i in range(len(list_of_companies)):
      final_data[i][f"scaled_{key}"] = scores[i]
  return final_data

def get_market_average(final_data):
  market_avg = {}
  for key in list(final_data[0].keys()).copy():
    if key=="website_url":
      continue
    scores = []
    for company in final_data:
      scores.append(company[key])
    market_avg[f"market_average_{key}"] = sum(scores) / len(scores)
  return market_avg


def main():
    target_company = "mistral.ai"
    raw_data = process_company(target_company) # Raw data
    companies_data = getQuantitativeData(raw_data)
    list_of_companies = [raw_data["main_company"]["website_domain"]]+[elem["website_domain"] for elem in raw_data["similar_companies"]]
    final_data = quantitativeDataScoring(companies_data, list_of_companies)
    scores = newsEventsScoring(list_of_companies)
    for i, company in enumerate(list_of_companies):
        final_data[i]["news_score"] = scores[i]
    market_average =  get_market_average(final_data)
    print(final_data)
    print(market_average)


if __name__=="__main__":
    main()