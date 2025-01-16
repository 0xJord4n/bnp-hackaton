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
  headcount: number;
  logo_url: string;
  website: HarmonicWebsite;
  location: HarmonicLocation;
  socials: { [key: string]: HarmonicSocial };
  funding: HarmonicFunding;
  founded: HarmonicFounded;
  customer_type: string;
  stage: string;
  // Add other company fields as needed
};

export type HarmonicInvestor = {
  entity_urn: string;
  name: string;
};

export type HarmonicFounded = {
  date: string;
  granularity: "YEAR" | "MONTH" | "DAY";
};

export type HarmonicFunding = {
  funding_total: number;
  num_funding_rounds: number;
  investors: HarmonicInvestor[];
  last_funding_at: string;
  last_funding_type: string;
  last_funding_total: number;
  funding_stage: string;
};

export type HarmonicSocial = {
  url: string;
  follower_count: number | null;
  username: string | null;
  status: string | null;
};

export type HarmonicHeaders = {
  accept: string;
  apikey: string;
};

export type HarmonicError = {
  message: string;
  status: number;
  // @ts-nocheck
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
