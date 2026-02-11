import type { CostPresenter } from '../application/ports/cost-presenter.port.js';
import type { UsagePresenter } from '../application/ports/usage-presenter.port.js';
import type { CostRecord, UsageRecord } from '../domain/entities.js';

export function createJsonPresenter(): UsagePresenter & CostPresenter {
  return {
    present(records: UsageRecord[] | CostRecord[]): void {
      console.log(JSON.stringify(records, null, 2));
    },

    presentSum(total: number, currency: string): void {
      console.log(JSON.stringify({ total, currency }, null, 2));
    },
  };
}
