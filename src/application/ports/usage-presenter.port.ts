import type { UsageRecord } from '../../domain/entities.js';

export type UsagePresenter = {
  present(records: UsageRecord[]): void;
};
