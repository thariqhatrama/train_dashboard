import { StatusResponse, SpeedData, statusResponseSchema, speedDataSchema } from "@shared/schema";

const API_BASE = "/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(url: string, schema: any): Promise<T> {
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiError(500, `Network error: ${error.message}`);
    }
    throw new ApiError(500, 'Unknown error occurred');
  }
}

export async function getStatus(): Promise<StatusResponse> {
  return fetchApi<StatusResponse>('/get_status.php', statusResponseSchema);
}

export async function getSpeedData(limit: number = 1): Promise<SpeedData[]> {
  return fetchApi<SpeedData[]>(`/get_status.php?mode=speed&limit=${limit}`, speedDataSchema.array());
}

export async function getSpeedHistory(limit: number = 20): Promise<SpeedData[]> {
  return fetchApi<SpeedData[]>(`/get_status.php?mode=speed&limit=${limit}`, speedDataSchema.array());
}
