import * as winston from 'winston';
import * as path from 'path';
import { homedir } from 'os';

// Ensure the log directory exists (optional, but good practice)
// This path assumes your server has a /var/log/nestjs directory.
// Make sure the user running your NestJS app has write permissions.
const logDir = path.join(homedir(), 'apps/logs');

// Create a logger dedicated to security events for Fail2Ban
export const securityLogger = winston.createLogger({
  level: 'warn',
  // Use a simple format that's easy for fail2ban to parse
  format: winston.format.printf(({ level, message, timestamp }) => {
    return `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}`;
  }),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'security.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});
