import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";

import { BaseService } from "../base/base.service";
import DtoUtil from "../common/utils/dto.util";
import Filter from "../common/utils/filter";
import { PageResult, RepoHelpers } from "../common/utils/repo_helpers";
import StringUtil from "../common/utils/string.util";
import { JSONValue } from "../model/data_object";
import { CreateNotificationSmsDto } from "./dto/create-notification_sms.dto";
import { ReadNotificationSmsDto } from "./dto/read-notification_sms.dto";
import { UpdateNotificationSmsDto } from "./dto/update-notification_sms.dto";
import { NotificationSms } from "./entities/notification_sms.entity";

@Injectable()
export class NotificationSmsService extends BaseService<NotificationSms> {
  constructor(
    @InjectRepository(NotificationSms)
    private readonly currentRepository: Repository<NotificationSms>,
    private readonly entityManager: EntityManager, // Inject the EntityManager for transactions

  ) {
    super(currentRepository);
  }

  async create(
    createDto: CreateNotificationSmsDto,
  ): Promise<ReadNotificationSmsDto> {
    const result = await RepoHelpers.create(NotificationSms, this, createDto);
    return DtoUtil.convertToDto(ReadNotificationSmsDto, result);
  }

  async findAll(): Promise<ReadNotificationSmsDto[]> {
    const results = await RepoHelpers.findAll<NotificationSms>(this);
    return DtoUtil.convertToDto(ReadNotificationSmsDto, results);
  }

  async findOne(id: string): Promise<ReadNotificationSmsDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadNotificationSmsDto, result);
  }

  async findOneBy(
    key: string,
    value: JSONValue,
  ): Promise<ReadNotificationSmsDto> {
    const result = await RepoHelpers.findOneBy(this, {
      [key]: value,
    });
    // as FindOptionsWhere<NotificationSms>
    return DtoUtil.convertToDto(ReadNotificationSmsDto, result);
  }

  async update(
    id: string,
    updateDto: UpdateNotificationSmsDto,
  ): Promise<ReadNotificationSmsDto> {
    const result = await RepoHelpers.update(
      NotificationSms,
      this,
      id,
      updateDto,
    );
    return DtoUtil.convertToDto(ReadNotificationSmsDto, result);
  }

  async remove(id: string): Promise<ReadNotificationSmsDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadNotificationSmsDto, result);
  }

  async page(
    queryBy: string | Filter,
  ): Promise<PageResult<ReadNotificationSmsDto>> {
    const filter: Filter =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<NotificationSms>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadNotificationSmsDto, result.data);
    return {
      data: dtos,
      count: result.count,
    } as PageResult<ReadNotificationSmsDto>;
  }

  async searchBy(queryBy: string | Filter): Promise<ReadNotificationSmsDto[]> {
    const filter: Filter =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);

    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadNotificationSmsDto, data);
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
     * @param maxRetries The maximum number of retries before an sms is ignored.
     * @returns A promise resolving to an array of the claimed sms entities.
     */
  async findAndMarkForProcessing(
    sent: boolean,
    newStatus: boolean,
    limit: number
  ): Promise<ReadNotificationSmsDto[]> {
    let claimedSmsList: NotificationSms[] = [];

    // A transaction ensures that the find and update operations are atomic (all or nothing).
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // Step 1: Find and Lock
      // Find emails that are 'pending' and have not exceeded the retry count.
      // `FOR UPDATE` locks the selected rows. `SKIP LOCKED` tells PostgreSQL
      // to ignore any rows that are already locked by another transaction.
      const smsToClaim = await transactionalEntityManager
        .createQueryBuilder(NotificationSms, 'sms')
        .select('sms.id')
        .where('sms.sent = :sent', { sent })
        // .andWhere('sms.ret ry_count < :maxRetries', { maxRetries })
        .orderBy('sms.created_at', 'ASC') // Process older emails first
        .limit(limit)
        .setLock('pessimistic_write') // Equivalent to SELECT ... FOR UPDATE
        .setOnLocked('skip_locked')     // Equivalent to SKIP LOCKED
        .getMany();

      if (smsToClaim.length === 0) {
        return; // No work to do, exit the transaction.
      }

      const smsIds = smsToClaim.map((sms) => sms.id);

      // Step 2: Update (Claim)
      // Update the status of the locked rows to 'processing'.
      // Because the rows are locked, no other process can interfere.
      await transactionalEntityManager
        .createQueryBuilder()
        .update(NotificationSms)
        .set({ sent: newStatus })
        .whereInIds(smsIds)
        .execute();

      // Step 3: Fetch the full objects to return
      // We re-fetch the full objects to ensure we return the updated state.
      claimedSmsList = await transactionalEntityManager.findBy(NotificationSms, { id: In(smsIds) });
    });

    return DtoUtil.convertToDto(ReadNotificationSmsDto, claimedSmsList);
  }


}
