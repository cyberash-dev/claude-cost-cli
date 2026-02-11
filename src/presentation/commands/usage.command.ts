import type { Command } from 'commander';
import type { UsagePresenter } from '../../application/ports/usage-presenter.port.js';
import { createGetUsageReportUseCase } from '../../application/use-cases/get-usage-report.use-case.js';
import type { UsageRepository } from '../../domain/usage-repository.port.js';

export function registerUsageCommand(
  program: Command,
  usageRepository: UsageRepository,
  getUsagePresenter: (json: boolean) => UsagePresenter,
): void {
  program
    .command('usage')
    .description('Retrieve usage report')
    .option('--from <date>', 'Start date (YYYY-MM-DD or ISO)')
    .option('--to <date>', 'End date (YYYY-MM-DD or ISO)')
    .option('--period <days>', 'Period in days (e.g. 7d, 30d, 90d)', '7d')
    .option('--model <models>', 'Filter by model(s), comma-separated')
    .option('--api-keys <ids>', 'Filter by API key ID(s), comma-separated')
    .option(
      '--group-by <fields>',
      'Group by model, api_key_id, workspace_id, service_tier (comma-separated)',
    )
    .option('--bucket <width>', 'Bucket width: 1d, 1h, 1m', '1d')
    .option('--json', 'Output as JSON')
    .action(async (opts) => {
      const usagePresenter = getUsagePresenter(Boolean(opts.json));
      const getUsage = createGetUsageReportUseCase(
        usageRepository,
        usagePresenter,
      );
      try {
        const models = opts.model
          ? (opts.model as string).split(',').map((s: string) => s.trim())
          : undefined;
        const apiKeyIds = opts.apiKeys
          ? (opts.apiKeys as string).split(',').map((s: string) => s.trim())
          : undefined;
        const groupBy = opts.groupBy
          ? (opts.groupBy as string).split(',').map((s: string) => s.trim())
          : ['model'];
        await getUsage({
          from: opts.from,
          to: opts.to,
          period: opts.period,
          models,
          apiKeyIds,
          groupBy,
          bucketWidth:
            opts.bucket === '1h' || opts.bucket === '1m' ? opts.bucket : '1d',
        });
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });
}
