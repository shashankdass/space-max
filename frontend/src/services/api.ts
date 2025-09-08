import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1'

export interface Space {
  id: number;
  title: string;
  description: string;
  space_type: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  price_per_hour: number;
  price_per_day?: number;
  price_per_week?: number;
  price_per_month?: number;
  area_sqft?: number;
  max_capacity?: number;
  amenities: string[];
  is_available: boolean;
  available_from?: string;
  available_until?: string;
  photos: string[];
  created_at: string;
  updated_at?: string;
}

export interface SpaceListResponse {
  spaces: Space[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface SpaceQueryParams {
  page?: number;
  per_page?: number;
  space_type?: string;
  city?: string;
  state?: string;
  min_price?: number;
  max_price?: number;
  is_available?: boolean;
  search?: string;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const spaceService = {
  async getSpaces(params: SpaceQueryParams = {}): Promise<SpaceListResponse> {
    const response = await api.get('/spaces', { params });
    return response.data;
  },

  async getSpace(id: number): Promise<Space> {
    const response = await api.get(`/spaces/${id}`);
    return response.data;
  },
};
