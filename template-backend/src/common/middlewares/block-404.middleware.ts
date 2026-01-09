import { Inject, Injectable, NestMiddleware, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';

import { securityLogger } from '../security/security-logger.service';

interface Tracker {
  count: number;
  lastSeen: number;
}

@Injectable()
export class Block404Middleware implements NestMiddleware, OnModuleInit {
  private static hits = new Map<string, Tracker>();
  private static blocked = new Map<string, number>();
  private static allRoutes: string[] = [];
  private static routePatterns: RegExp[] = [];

  constructor(
    @Inject(HttpAdapterHost) private readonly adapterHost: HttpAdapterHost,
  ) {}

  onModuleInit() {
    // This logic runs once on startup to get all registered routes
    const expressApp = this.adapterHost.httpAdapter.getInstance();
    const router = expressApp.router;

    Block404Middleware.allRoutes = router.stack
      .filter((layer: any) => layer.route)
      .map((layer: any) => layer.route.path);

    // Convert routes like '/users/:id' into RegExp for accurate matching
    Block404Middleware.routePatterns = Block404Middleware.allRoutes.map(
      (route) => {
        const pattern = route.replace(/:[^\s/]+/g, '([\\w-]+)');
        return new RegExp(`^${pattern}$`);
      },
    );
  }

  private readonly maxAttempts = 5; // Attempts before a ban
  private readonly windowMs = 10 * 60 * 1000; // 10 minutes sliding window
  private readonly banMs = 60 * 60 * 1000; // 1 hour ban

  private routeExists(path: string): boolean {
    // Check against the pre-compiled route patterns
    return Block404Middleware.routePatterns.some((pattern) =>
      pattern.test(path),
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress;
    if (!ip) return next();

    // 1. Check if IP is already blocked by the in-app blocker
    const banExpires = Block404Middleware.blocked.get(ip);
    if (banExpires && banExpires > Date.now()) {
      res.status(403).json({ message: 'Your IP is temporarily blocked.' });
      return;
    } else if (banExpires) {
      // Clean up expired ban
      Block404Middleware.blocked.delete(ip);
    }

    // 2. Attach listener to check response after NestJS has handled it
    res.on('finish', () => {
      // We only care about 404s
      if (res.statusCode !== 404) {
        return;
      }

      // Double-check if the route really doesn't exist.
      // This prevents banning for legitimate 404s thrown within a valid route.
      if (this.routeExists(req.path)) {
        return;
      }

      const now = Date.now();
      const record = Block404Middleware.hits.get(ip) || {
        count: 0,
        lastSeen: now,
      };

      // Reset count if the last attempt was outside the time window
      if (now - record.lastSeen > this.windowMs) {
        record.count = 1;
      } else {
        record.count++;
      }

      record.lastSeen = now;
      Block404Middleware.hits.set(ip, record);

      // 3. If attempts exceed the max, ban the IP
      if (record.count >= this.maxAttempts) {
        // In-app ban (immediate effect)
        Block404Middleware.blocked.set(ip, now + this.banMs);
        Block404Middleware.hits.delete(ip);

        // Log for Fail2Ban (persistent ban)
        const logMessage = `[NESTJS-404-BAN] Banning IP: ${ip} for too many 404s.`;
        securityLogger.warn(logMessage);

        console.warn(`IP ${ip} added to in-app block and logged for Fail2Ban.`);
      }
    });

    next();
  }
}
