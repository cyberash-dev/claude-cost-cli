import type { CostRecord, CostReportQuery } from './entities.js';

export type CostRepository = {
  query(params: CostReportQuery): Promise<CostRecord[]>;
};
