import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { BaseService } from '../base/base.service';
import DtoUtil from '../common/utils/dto.util';
import Filter from '../common/utils/filter';
import { PageResult, RepoHelpers } from '../common/utils/repo_helpers';
import StringUtil from '../common/utils/string.util';
import { ReadNotificationEmailsDto } from './dto/read-notification_emails.dto';
import { UpdateNotificationEmailsDto } from './dto/update-notification_emails.dto';
import { NotificationEmails } from './entities/notification_emails.entity';
import { CreateNotificationEmailsDto } from './dto/create-notification_emails.dto';
import { JSONValue } from '../model/data_object';

@Injectable()
export class NotificationEmailsService extends BaseService<NotificationEmails> {
  constructor(
    @InjectRepository(NotificationEmails)
    private readonly currentRepository: Repository<NotificationEmails>,
    private readonly entityManager: EntityManager, // Inject the EntityManager for transactions
  ) {
    super(currentRepository);
  }

  async create(
    createDto: CreateNotificationEmailsDto,
  ): Promise<ReadNotificationEmailsDto> {
    const result = await RepoHelpers.create(
      NotificationEmails,
      this,
      createDto,
    );
    return DtoUtil.convertToDto(ReadNotificationEmailsDto, result);
  }

  async findAll(): Promise<ReadNotificationEmailsDto[]> {
    const results = await RepoHelpers.findAll<NotificationEmails>(this);
    return DtoUtil.convertToDto(ReadNotificationEmailsDto, results);
  }

  async findOne(id: string): Promise<ReadNotificationEmailsDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadNotificationEmailsDto, result);
  }

  async findOneBy(
    key: keyof NotificationEmails,
    value: JSONValue,
  ): Promise<ReadNotificationEmailsDto> {
    const result = await RepoHelpers.findOneBy(this, {
      [key]: value,
    });
    // as FindOptionsWhere<NotificationEmails>
    return DtoUtil.convertToDto(ReadNotificationEmailsDto, result);
  }

  async update(
    id: string,
    updateDto: UpdateNotificationEmailsDto,
  ): Promise<ReadNotificationEmailsDto> {
    const result = await RepoHelpers.update(
      NotificationEmails,
      this,
      id,
      updateDto,
    );
    return DtoUtil.convertToDto(ReadNotificationEmailsDto, result);
  }

  async remove(id: string): Promise<ReadNotificationEmailsDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadNotificationEmailsDto, result);
  }

  async page(
    queryBy: string | Filter,
  ): Promise<PageResult<ReadNotificationEmailsDto>> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<NotificationEmails>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadNotificationEmailsDto, result.data);
    return {
      data: dtos,
      count: result.count,
    } as PageResult<ReadNotificationEmailsDto>;
  }

  async searchBy(
    queryBy: string | Filter,
  ): Promise<ReadNotificationEmailsDto[]> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);

    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadNotificationEmailsDto, data);
  }

  async count(r?: boolean): Promise<number> {
    return RepoHelpers.count(this, r);
  }

  /**
   * Atomically finds and claims a batch of emails for processing.
   *
   * @param sent The current status of emails to find (e.g., 'pending').
   * @param newStatus The status to update the emails to (e.g., 'processing').
   * @param limit The maximum number of emails to claim.
   * @param maxRetries The maximum number of retries before an email is ignored.
   * @returns A promise resolving to an array of the claimed email entities.
   */
  async findAndMarkForProcessing(
    sent: boolean,
    newStatus: boolean,
    limit: number,
  ): Promise<ReadNotificationEmailsDto[]> {
    let claimedEmails: NotificationEmails[] = [];

    // A transaction ensures that the find and update operations are atomic (all or nothing).
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // Step 1: Find and Lock
      // Find emails that are 'pending' and have not exceeded the retry count.
      // `FOR UPDATE` locks the selected rows. `SKIP LOCKED` tells PostgreSQL
      // to ignore any rows that are already locked by another transaction.
      const emailsToClaim = await transactionalEntityManager
        .createQueryBuilder(NotificationEmails, 'email')
        .select('email.id')
        .where('email.sent = :sent', { sent })
        // .andWhere('email.retry_count < :maxRetries', { maxRetries })
        .orderBy('email.created_at', 'ASC') // Process older emails first
        .limit(limit)
        .setLock('pessimistic_write') // Equivalent to SELECT ... FOR UPDATE
        .setOnLocked('skip_locked') // Equivalent to SKIP LOCKED
        .getMany();

      if (emailsToClaim.length === 0) {
        return; // No work to do, exit the transaction.
      }

      const emailIds = emailsToClaim.map((email) => email.id);

      // Step 2: Update (Claim)
      // Update the status of the locked rows to 'processing'.
      // Because the rows are locked, no other process can interfere.
      await transactionalEntityManager
        .createQueryBuilder()
        .update(NotificationEmails)
        .set({ sent: newStatus })
        .whereInIds(emailIds)
        .execute();

      // Step 3: Fetch the full objects to return
      // We re-fetch the full objects to ensure we return the updated state.
      claimedEmails = await transactionalEntityManager.findBy(
        NotificationEmails,
        { id: In(emailIds) },
      );
    });

    return DtoUtil.convertToDto(ReadNotificationEmailsDto, claimedEmails);
  }
}
