import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronManagerService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // Stops a cron job by its name
  stopCronJob(jobName: string): boolean {
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      job.stop();
      return true;
    } catch (error) {
      console.error(`Error stopping cron job '${jobName}': ${error.message}`);
      return false;
    }
  }

  // Starts a cron job by its name
  startCronJob(jobName: string): boolean {
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      job.start();
      return true;
    } catch (error) {
      console.error(`Error starting cron job '${jobName}': ${error.message}`);
      return false;
    }
  }

  // Returns a list of all registered cron jobs
  getCronJobs(): Map<string, CronJob> {
    return this.schedulerRegistry.getCronJobs();
  }

  // Gets details of a specific cron job
  getCronJobDetails(jobName: string): CronJob | null {
    try {
      return this.schedulerRegistry.getCronJob(jobName);
    } catch (error) {
      console.error(`Error retrieving cron job '${jobName}': ${error.message}`);
      return null;
    }
  }
}
