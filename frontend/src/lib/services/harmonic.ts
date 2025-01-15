import { HarmonicCompany, HarmonicError, HarmonicResponse, SimilarCompaniesResponse } from "../types";


export const HARMONIC_CONFIG = {
    endpoint: "https://api.harmonic.ai/",
    headers: {
        accept: "application/json",
        // apikey: process.env.HARMONIC_API_KEY || "",
        apikey: "onKaXi9su8Zuo3xqYMYNYIf2xTh13oOm"
    },
} as const;


class HarmonicService {
    private endpoint: string;
    private headers: HeadersInit;

    constructor() {
        this.endpoint = HARMONIC_CONFIG.endpoint;
        this.headers = HARMONIC_CONFIG.headers;
    }

    private async handleRequest<T>(
        url: string,
        options: RequestInit = {}
    ): Promise<HarmonicResponse<T>> {
        try {
            const response = await fetch(url, {
                ...options,
                headers: this.headers,
            });

            if (!response.ok) {
                const error: HarmonicError = {
                    message: `API request failed with status ${response.status}`,
                    status: response.status,
                };
                return { data: null, error };
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            const harmonicError: HarmonicError = {
                message: 'An unexpected error occurred',
                status: 500,
                error,
            };
            return { data: null, error: harmonicError };
        }
    }

    async getCompanyByUrl(url: string): Promise<HarmonicResponse<HarmonicCompany>> {
        return this.handleRequest<HarmonicCompany>(
            `${this.endpoint}companies?website_domain=${url}`,
            { method: 'POST' }
        );
    }

    async getCompanyById(urn: string): Promise<HarmonicResponse<HarmonicCompany>> {
        return this.handleRequest<HarmonicCompany>(
            `${this.endpoint}/companies/${urn}`
        );
    }

    async getSimilarCompanies(
        compId: string,
        size: number = 5
    ): Promise<HarmonicResponse<SimilarCompaniesResponse>> {
        return this.handleRequest<SimilarCompaniesResponse>(
            `${this.endpoint}/search/similar_companies/${compId}?size=${size}`
        );
    }

    // Add more methods as needed...
}

export const harmonicService = new HarmonicService();