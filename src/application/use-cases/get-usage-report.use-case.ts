import type { UsageReportQuery } from '../../domain/entities.js';
import type { UsageRepository } from '../../domain/usage-repository.port.js';
import { parseDateRange } from '../date-range.helper.js';
import type { UsagePresenter } from '../ports/usage-presenter.port.js';

type GetUsageReportParams = {
  period?: string;
  from?: string;
  to?: string;
  models?: string[];
  apiKeyIds?: string[];
  groupBy?: string[];
  bucketWidth?: '1d' | '1h' | '1m';
};

export function createGetUsageReportUseCase(
  usageRepository: UsageRepository,
  usagePresenter: UsagePresenter,
): (params: GetUsageReportParams) => Promise<void> {
  return async (params) => {
    const dateRange = parseDateRange(params.period, params.from, params.to);
    const query: UsageReportQuery = {
      dateRange,
      models: params.models,
      apiKeyIds: params.apiKeyIds,
      groupBy: params.groupBy,
      bucketWidth: params.bucketWidth ?? '1d',
    };
    const records = await usageRepository.query(query);
    usagePresenter.present(records);
  };
}
