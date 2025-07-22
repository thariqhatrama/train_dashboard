import type { Express } from "express";
import { createServer, type Server } from "http";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Proxy route for get_status.php (handles both status and speed endpoints)
  app.get('/get_status.php', async (req, res) => {
    try {
      const queryString = req.url.split('?')[1] || '';
      const wrapperFile = path.join(import.meta.dirname, 'php_wrapper.php');
      
      const php = spawn('php', [wrapperFile], {
        env: {
          ...process.env,
          QUERY_STRING: queryString,
          REQUEST_METHOD: 'GET'
        }
      });

      let output = '';
      let error = '';

      php.stdout.on('data', (data) => {
        output += data.toString();
      });

      php.stderr.on('data', (data) => {
        error += data.toString();
      });

      php.on('close', (code) => {
        if (code !== 0) {
          console.error('PHP Error:', error);
          res.status(500).json({ error: 'Internal server error', details: error });
          return;
        }
        
        // Set appropriate headers
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        try {
          // Try to parse as JSON to validate
          JSON.parse(output);
          res.send(output);
        } catch (e) {
          console.error('Invalid JSON output:', output);
          res.status(500).json({ error: 'Invalid JSON response' });
        }
      });

    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Proxy route for api_supabase.php (for posting speed data)
  app.post('/api_supabase.php', async (req, res) => {
    try {
      const phpFile = path.join(import.meta.dirname, 'api_supabase_1753106332236.php');
      
      const php = spawn('php', [phpFile], {
        env: {
          ...process.env,
          REQUEST_METHOD: 'POST',
          CONTENT_TYPE: 'application/json'
        }
      });

      // Send POST data to PHP script
      php.stdin.write(JSON.stringify(req.body));
      php.stdin.end();

      let output = '';
      let error = '';

      php.stdout.on('data', (data) => {
        output += data.toString();
      });

      php.stderr.on('data', (data) => {
        error += data.toString();
      });

      php.on('close', (code) => {
        if (code !== 0) {
          console.error('PHP Error:', error);
          res.status(500).json({ error: 'Internal server error', details: error });
          return;
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        try {
          JSON.parse(output);
          res.send(output);
        } catch (e) {
          console.error('Invalid JSON output:', output);
          res.status(500).json({ error: 'Invalid JSON response' });
        }
      });

    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Proxy route for train_insert.php (for logging train events)
  app.get('/train_insert.php', async (req, res) => {
    try {
      const queryString = req.url.split('?')[1] || '';
      
      // Create wrapper for train_insert
      const trainWrapperFile = path.join(import.meta.dirname, 'train_wrapper.php');
      
      const php = spawn('php', [trainWrapperFile], {
        env: {
          ...process.env,
          QUERY_STRING: queryString,
          REQUEST_METHOD: 'GET'
        }
      });

      let output = '';
      let error = '';

      php.stdout.on('data', (data) => {
        output += data.toString();
      });

      php.stderr.on('data', (data) => {
        error += data.toString();
      });

      php.on('close', (code) => {
        if (code !== 0) {
          console.error('PHP Error:', error);
          res.status(500).send(error);
          return;
        }
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(output);
      });

    } catch (error) {
      console.error('Route error:', error);
      res.status(500).send('Server error');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
