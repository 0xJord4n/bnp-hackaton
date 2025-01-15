export type HarmonicWebsite = {
    url: string;
    domain: string;
    is_broken: boolean;
};

export type HarmonicLocation = {
    address_formatted: string;
    location: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};

export type HarmonicCompany = {
    id: string;
    name: string;
    description: string;
    logo_url : string;
    website: HarmonicWebsite;
    location: HarmonicLocation;
    // Add other company fields as needed
};

export type HarmonicHeaders = {
    accept: string;
    apikey: string;
};

export type HarmonicError = {
    message: string;
    status: number;
    error?: any;
};

export type HarmonicResponse<T> = {
    data: T | null;
    error: HarmonicError | null;
};

export interface SimilarCompaniesResponse {
    count: number;
    page_info: null;
    results: string[];
}