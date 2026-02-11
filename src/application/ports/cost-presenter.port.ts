import type { CostRecord } from '../../domain/entities.js';

export type CostPresenter = {
  present(records: CostRecord[]): void;
  presentSum(total: number, currency: string): void;
};
