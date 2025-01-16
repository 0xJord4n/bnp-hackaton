import instructor
import json
from pydantic import BaseModel
from openai import OpenAI
from pydantic import BaseModel, Field
from typing import List, Optional, Union
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
openai_model = "gpt-4o-mini"

# Patch the OpenAI client
client = instructor.from_openai(OpenAI(api_key=openai_key))


class Company(BaseModel):
    """Represents a single company with its basic information"""

    urn: Optional[str] = None
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    founding_date: Union[str, dict] = None
    website_url: Optional[str] = None
    funding_stage: Optional[str] = None
    headcount_latest_metric_value: Union[str, float, None] = None
    linkedin_latest_metric_value: Union[str, float, None] = None 


class CompetitorsInput(BaseModel):
    """Represents a list of companies"""

    companies: List[Company]


# Define your desired output structure
class CompetitorsOutput(BaseModel):
    company_urn: List[str] = Field(description="List of 3 - 5 most similar competitors")


sys_prompt = """
You are an assistant tasked with identifying the most relevant direct competitors for a specified company based on a provided JSON input. Your analysis should focus on similarity in industry, products/services, target market, and overall business model. Return the top 3-5 most relevant competitors.

Input Format:
The input is a JSON object structured as follows:

{
  "main_company": {
    "company_name": "string",
    "company_description": "string",
    "location": "string",
    "founding_date": "string",
    "website_url": "string",
    "funding_stage": "string",
    "headcount_latest_metric_value": "string",
    "linkedin_latest_metric_value": "string"

  },
  "competitors": [
    {
      "company_name": "string",
      "company_description": "string",
      "location": "string",
        "founding_date": "string",
        "website_url": "string",
        "funding_stage": "string",
        "headcount_latest_metric_value": "string",
        "linkedin_latest_metric_value": "string"
    },
    ...
  ]
}

Your Task:
For each competitor company compare its industry, products or services offered, target market and business model with the main company. 
And take also into account the desciption, the location, the founding_date, the funding_stage, the headcount_latest_metric_value and the linkedin_latest_metric_value of the main company and its competitors.
Evaluate the similarity of each competitor to the main company based on the above critaria.
Rank the competitors by relevance, prioritizing those with the highest similarity.
Return the 3-5 most relevant competitors in the form of a JSON list of company_name values.
Output Format:
Return the result as:

["competitor_1_urn", "competitor_2_urn", "competitor_3_urn"]
Notes:
Focus only on direct competitors operating in the same or overlapping industries.
If relevance scores are tied, prioritize companies with greater market or product overlap.
Ensure no more than 5 competitors are included in the final list.
"""

prompt_template = """
{main_company}

{competitors}

"""


def open_ai_chat_completion(
    client, response_model, system_prompt: str, prompt: str
) -> CompetitorsOutput:
    """
    Create a structured completion using OpenAI's API with instructor

    Args:
        client: instructor-patched OpenAI client
        response_model: Pydantic model class for response structure
        system_prompt: System prompt to guide the model
        prompt: User prompt/input data

    Returns:
        Instance of the response_model
    """
    response = client.chat.completions.create(
        model=openai_model,
        response_model=response_model,
        messages=[
            {"role": "system", "content": [{"type": "text", "text": system_prompt}]},
            {"role": "user", "content": [{"type": "text", "text": prompt}]},
        ],
    )
    return response


def get_similar_competitors(
    company: Company, competitors: List[Company]
) -> CompetitorsOutput:

    formatted_main_company = company.model_dump()  # Convert Company model to dictionary
    formatted_competitors = [comp.model_dump() for comp in competitors]  # List of dictionaries

    formatted_dump = prompt_template.format(
        main_company=json.dumps(formatted_main_company, indent=2),
        competitors=json.dumps(formatted_competitors, indent=2),
    )

    response = open_ai_chat_completion(
        client,
        CompetitorsOutput,
        sys_prompt,
        formatted_dump,
    )

    return response


if __name__ == "__main__":
    # Example usage
    company = {
        "company_name": "Swotzy",
        "company_description": "The company provides a shipping software solution designed for eCommerce parcel delivery, enabling businesses to select optimal carriers while reducing shipping expenses. The platform features a management dashboard for multi-carrier shipping, integrates with major eCommerce systems, and offers API capabilities to enhance shipping efficiency.",
    }
    competitors = [
        {
            "urn": "urn:harmonic:company:6768301",
            "name": "OpenBorder",
            "description": "OpenBorder provides a platform that facilitates global direct-to-consumer and Amazon sales by integrating technologies such as multi-currency pricing, VAT-inclusive pricing, and automated tax calculations to enhance cross-border logistics. The service also focuses on compliance management and optimizing shipping processes to support e-commerce brands in their international expansion efforts.",
        },
        {
            "urn": "urn:harmonic:company:739326",
            "name": "ShipHawk",
            "description": "ShipHawk offers a warehouse management system (WMS) that automates logistics processes such as receiving, picking, packing, and shipping to enhance operational efficiency. The platform employs robust APIs for integration with various logistics systems, enabling optimized order fulfillment and cost savings.",
        },
        {
            "urn": "urn:harmonic:company:4293196",
            "name": "Grip",
            "description": "Grip offers a logistics solution tailored for perishable goods, employing automated carrier and facility selection, real-time weather monitoring, and comprehensive shipping analytics to optimize operational efficiency. The platform supports API integration for automated decision-making, aimed at reducing shipping costs and enhancing service delivery.",
        },
        {
            "urn": "urn:harmonic:company:123177",
            "name": "MasonHub",
            "description": "MasonHub provides a customizable third-party logistics (3PL) fulfillment platform specifically designed for beauty, fashion, and wellness brands, incorporating real-time inventory management, order processing, and shipping logistics. The platform integrates with various e-commerce systems and utilizes open AI to enhance operational efficiency and scalability.",
        },
        {
            "urn": "urn:harmonic:company:1760909",
            "name": "Nimble",
            "description": "Nimble provides a fully autonomous logistics service utilizing AI-driven robots to execute key warehouse functions such as picking, packing, and sorting. This robotic system is enhanced by cloud logistics tools that streamline inventory management and transportation strategies for efficient order fulfillment.",
        },
    ]

    response = get_similar_competitors(company, competitors)
