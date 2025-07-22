import type { Express } from "express";
import { createServer, type Server } from "http";
import { getTrackStatus, getSpeedData, postSpeedData, postTrainLog } from "./status";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Route for get_status.php (handles both status and speed endpoints)
  app.get('/get_status.php', async (req, res) => {
    try {
      if (req.query.mode === 'speed') {
          const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 1;
          const speedData = await getSpeedData(limit);
          res.json(speedData);
      } else {
          const status = await getTrackStatus();
          res.json(status);
      }
    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Route for api_supabase.php (for posting speed data)
  app.post('/api_supabase.php', async (req, res) => {
      try {
          if (!req.body.kecepatan || !req.body.mode) {
              return res.status(400).json({ error: 'Missing required fields' });
          }
          await postSpeedData(req.body);
          res.status(200).json({ status: 'success', message: 'Data logged successfully' });
      } catch (error) {
          console.error('Route error:', error);
          res.status(500).json({ error: 'Server error' });
      }
  });

  // Route for train_insert.php (for logging train events)
  app.get('/train_insert.php', async (req, res) => {
      try {
          const { checkpoint, status } = req.query;
          if (!checkpoint || !status) {
              return res.status(400).send("Missing 'checkpoint' or 'status' parameter.");
          }
          await postTrainLog({ checkpoint, status });
          res.status(200).send("✅ Data sent successfully to Supabase!");
      } catch (error) {
          console.error('Route error:', error);
          res.status(500).send('Server error');
      }
  });

  const httpServer = createServer(app);
  return httpServer;
}
