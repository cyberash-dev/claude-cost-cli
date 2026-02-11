import type { Command } from 'commander';
import type { CostPresenter } from '../../application/ports/cost-presenter.port.js';
import { createGetCostReportUseCase } from '../../application/use-cases/get-cost-report.use-case.js';
import type { CostRepository } from '../../domain/cost-repository.port.js';

export function registerCostCommand(
  program: Command,
  costRepository: CostRepository,
  getCostPresenter: (json: boolean) => CostPresenter,
): void {
  program
    .command('cost')
    .description('Retrieve cost report')
    .option('--from <date>', 'Start date (YYYY-MM-DD or ISO)')
    .option('--to <date>', 'End date (YYYY-MM-DD or ISO)')
    .option('--period <days>', 'Period in days (e.g. 7d, 30d, 90d)', '7d')
    .option(
      '--group-by <fields>',
      'Group by workspace_id, description (comma-separated)',
    )
    .option('--json', 'Output as JSON')
    .option('--sum', 'Output total sum only')
    .action(async (opts) => {
      const costPresenter = getCostPresenter(Boolean(opts.json));
      const getCost = createGetCostReportUseCase(costRepository, costPresenter);
      try {
        const groupBy = opts.groupBy
          ? (opts.groupBy as string).split(',').map((s: string) => s.trim())
          : ['description'];
        await getCost({
          from: opts.from,
          to: opts.to,
          period: opts.period,
          groupBy: groupBy as ('workspace_id' | 'description')[] | undefined,
          sumOnly: Boolean(opts.sum),
        });
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });
}
