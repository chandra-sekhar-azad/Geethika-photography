/**
 * Global Environment Loader
 * Ensures both root .env and local .env files are reliably loaded
 * across all deployment environments (Local, Docker, Hostinger).
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ordered priority list of paths to look for the single source of truth .env
const candidatePaths = [
  path.resolve(__dirname, '../../.env'), // Workspace / project root .env
  path.resolve(__dirname, '../.env'),    // Backend directory .env
  path.resolve(process.cwd(), '.env'),   // Current working directory .env
  path.resolve(process.cwd(), '../.env') // Parent of working directory
];

for (const envPath of candidatePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

dotenv.config();

export default process.env;
