from .data_processing import process_main_company, process_similar_companies

def getQuantitativeData(full_data):
  full_data_list = [full_data["main_company"]] + full_data["similar_companies"]
  data_to_get = {'funding':'funding_total', 'linkedin': 'linkedin_latest_metric_value', 'headcount': 'headcount_latest_metric_value', 'web_traffic': 'web_traffic_latest_metric_value', 'likedin_growth': 'linkedin_30d_ago_percent_change', 'headcount_growth': 'headcount_30d_ago_percent_change', 'web_traffic_growth': 'web_traffic_365d_ago_percent_change'}
  data = []
  for elem in full_data_list:
    data.append({})
    for key in data_to_get.keys():
      data[-1][key] = elem[data_to_get[key]]
  return data

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

def get_growth_avg(final_data):
  for company in final_data:
    growth_score = 0
    n = 0
    for key in company.keys():
      if "growth" in key:
        n+=1
        growth_score += company[key]
    company["growth_score"] = growth_score / n
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


def process_scoring(target_company):
    """
    Process the scoring for the target company and its competitors.
    """
    raw_main_company_data = process_main_company(target_company)
    raw_comperitors_data = process_similar_companies(target_company)

    raw_data = {
        "main_company": raw_main_company_data,
        "similar_companies": raw_comperitors_data,
    }

    # Generate quantitative data
    companies_data = getQuantitativeData(raw_data)
    list_of_companies = [raw_data["main_company"]["website_domain"]] + [
        elem["website_domain"] for elem in raw_data["similar_companies"]
    ]

    # Compute scores
    final_data = quantitativeDataScoring(companies_data, list_of_companies)
    final_data = get_growth_avg(final_data)
    market_average = get_market_average(final_data)

    # Return results
    return {"companies_scores": final_data, "market_scores": market_average}
