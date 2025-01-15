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
  website: HarmonicWebsite;
  location: HarmonicLocation;
  socials: { [key: string]: HarmonicSocial };
  // Add other company fields as needed
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
  error?: any;
};

export type HarmonicResponse<T> = {
  data: T | null;
  error: HarmonicError | null;
};
