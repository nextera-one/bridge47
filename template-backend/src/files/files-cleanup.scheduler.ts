import { Cron, CronExpression } from '@nestjs/schedule';
// src/files/files-cleanup.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FilesService } from './files.service';
@Injectable()
export class FilesCleanupScheduler {
  private readonly logger = new Logger(FilesCleanupScheduler.name);
  private isRunning = false; // In-memory lock to prevent overlapping runs on the same node

  private readonly batchSize: number;
  private readonly ttlMs: number;

  constructor(
    private readonly filesService: FilesService, // Inject the new service
    private readonly config: ConfigService,
  ) {
    // It's good practice to fetch configuration once in the constructor
    this.batchSize = this.config.get<number>('files.cleanup.batchSize', 1000);
    this.ttlMs = this.config.get<number>('files.cleanup.ttlMs', 60 * 60 * 1000); // 1 hour
  }

  /**
   * Every 5 minutes: claims and deletes unlinked temp files older than 1 hour.
   * This job is safe to run across multiple horizontally-scaled instances.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCleanup() {
    if (this.isRunning) {
      this.logger.warn(
        'Skipping cleanup; previous run on this node is still in progress.',
      );
      return;
    }
    this.isRunning = true;

    let totalDeleted = 0;
    try {
      // Loop in batches until no more records are found for deletion.
      // This prevents a single cron run from holding a transaction for too long
      // if there are millions of records to delete.
      let affectedRows: number;
      // do {
      //   affectedRows = await this.filesService.claimAndDeleteUnlinkedFiles(
      //     this.ttlMs,
      //     this.batchSize,
      //   );
      //   totalDeleted += affectedRows;
      // } while (affectedRows === this.batchSize); // If we deleted a full batch, there might be more.

      if (totalDeleted > 0) {
        this.logger.log(
          `Files cleanup successfully removed ${totalDeleted} stale, unlinked file records.`,
        );
      }
    } catch (err: any) {
      this.logger.error(`Files cleanup failed: ${err.message}`, err?.stack);
    } finally {
      this.isRunning = false; // Release the lock
    }
  }
}
