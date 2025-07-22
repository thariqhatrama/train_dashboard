import { z } from "zod";

// Traffic light state schema
export const lightStateSchema = z.object({
  red: z.boolean(),
  yellow: z.boolean(),
  green: z.boolean(),
});

// Train status schema
export const trainStatusSchema = z.object({
  running: z.string().nullable(),
  parking: z.array(z.string()),
});

// Activity log entry schema
export const activityLogSchema = z.object({
  checkpoint: z.string(),
  status: z.string(),
  timestamp: z.string(),
});

// Main status response schema
export const statusResponseSchema = z.object({
  lights: z.record(lightStateSchema),
  trains: trainStatusSchema,
  route: z.string(),
  logs: z.array(activityLogSchema),
});

// Speed data schema
export const speedDataSchema = z.object({
  id: z.number().optional(),
  kecepatan: z.number(),
  mode: z.string(),
  warna: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

// Type exports
export type LightState = z.infer<typeof lightStateSchema>;
export type TrainStatus = z.infer<typeof trainStatusSchema>;
export type ActivityLog = z.infer<typeof activityLogSchema>;
export type StatusResponse = z.infer<typeof statusResponseSchema>;
export type SpeedData = z.infer<typeof speedDataSchema>;

// Checkpoint and station enums
export const CHECKPOINTS = ['CP1', 'CP2', 'CP3', 'CP4', 'CP5'] as const;
export const STATIONS = ['SU', 'SS'] as const;
export const ALL_POINTS = [...STATIONS, ...CHECKPOINTS] as const;

export type Checkpoint = typeof CHECKPOINTS[number];
export type Station = typeof STATIONS[number];
export type TrackPoint = typeof ALL_POINTS[number];
