import { StatusResponse, SpeedData, ActivityLog } from "@shared/schema";

// Railway monitoring storage interface
export interface IStorage {
  getStatus(): Promise<StatusResponse>;
  getSpeedData(limit: number): Promise<SpeedData[]>;
  getActivityLogs(): Promise<ActivityLog[]>;
}

export class MemStorage implements IStorage {
  // Since we're proxying to existing PHP endpoints, we don't need internal storage
  // This class serves as a placeholder for future database integration
  
  async getStatus(): Promise<StatusResponse> {
    // This would be implemented if we were storing data locally
    // For now, the API endpoints directly call the PHP scripts
    throw new Error("Storage methods should not be called - using direct PHP proxy");
  }

  async getSpeedData(limit: number): Promise<SpeedData[]> {
    throw new Error("Storage methods should not be called - using direct PHP proxy");
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    throw new Error("Storage methods should not be called - using direct PHP proxy");
  }
}

export const storage = new MemStorage();
