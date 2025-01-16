# VCLens - A lens into market and competitor landscapes for VCs
Our application give detailed market and competitor insights for a company you want to analyze. 
The can get a lot of insighfull metrics such as traffic, headcount, funding, Linkedin statistics, put also a momentum score comparing the company to its competitors. 
The tool includes a Next.js frontend and a Django backend.

## Features
- Retrieve detailed metrics for a target company and its competitors.
- Compute momentum scores based on funding, traffic, headcount, and growth metrics.
- Compare a company's performance to its competitors with market averages.
- REST API endpoints for integration into VC workflows.
- Frontend UI for streamlined insights.

# Getting Started

## 1. Prerequisites
Node.js (v16+ recommended)
Docker
pip

## 2. Clone the Repository
git clone https://github.com/redriverwest/ddvc-hackathon.git

## 3. Environment Setup

### Backend
Navigate to the backend directory:
cd backend
Create a .env file in the backend directory and add the following keys:
OPENAI_API_KEY="your_openai_api_key"
HARMONIC_API_KEY="your_harmonic_api_key"

Run the following commands to build and launch the backend:
make build
make run

It will create a Docker image and launch the Docker container so that you can then test the endpoints on localhost80000

### Frontend
Navigate to the frontend directory:
cd ../frontend
Create a .env file in the frontend directory and add:

PERPLEXITY_API_KEY="your_perplexity_api_key"

Main Company Information
URL: /main/
Method: POST
Body:
{
    "domain": "https://www.motionsociety.com/"
}
Response:
Returns detailed metrics for the main company.

Retrieve Competitor Data
URL: /list/
Method: POST
Body:
{
    "domain": "https://www.motionsociety.com/"
}
Response:
Returns filtered competitors with detailed metrics.

Compute Scoring
URL: /scoring/
Method: POST
Body:
{
    "domain": "https://www.motionsociety.com/"
}
Response:
Returns companies_scores: Scaled scores for the main company and its competitors.

Example CURL Requests
Main Company:
curl -X POST http://127.0.0.1:8000/main/ \
-H "Content-Type: application/json" \
-d '{"domain": "https://www.motionsociety.com/"}'

Competitors List:
curl -X POST http://127.0.0.1:8000/list/ \
-H "Content-Type: application/json" \
-d '{"domain": "https://www.motionsociety.com/"}'

Scoring:
curl -X POST http://127.0.0.1:8000/scoring/ \
-H "Content-Type: application/json" \
-d '{"domain": "https://www.motionsociety.com/"}'

# How It Works
Backend Workflow:

Collects data from external APIs like Harmonic, and OpenAI.
Filters competitors using OpenAI-based logic.
Computes momentum scores based on metrics like funding, traffic, and LinkedIn growth.
