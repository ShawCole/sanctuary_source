export interface Location {
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'facilitator' | 'venue' | 'admin';
  region: 'US' | 'EEA' | 'UK' | 'CA' | 'OTHER';
}

export interface Guide {
  id: string;
  name: string;
  avatar: string;
}

export interface Venue {
  id: string;
  name: string;
}

export interface Program {
  id: string;
  title: string;
  location: Location;
  startDate: string;
  endDate: string;
  durationDays: number;
  themes: string[];
  venueType: string;
  priceUSD: number;
  groupSize: 'small' | 'medium' | 'large';
  guide: Guide;
  venue: Venue;
  rating: number;
  images: string[];
}

export interface SearchParams {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  guests?: number;
  themes?: string[];
  venueType?: string;
  duration?: number;
  priceMin?: number;
  priceMax?: number;
  groupSize?: string;
  location?: string;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'soonest' | 'popular' | 'rating';
}