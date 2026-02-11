import type { UsageRecord, UsageReportQuery } from './entities.js';

export type UsageRepository = {
  query(params: UsageReportQuery): Promise<UsageRecord[]>;
};
