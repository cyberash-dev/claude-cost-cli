import chalk from 'chalk';
import Table from 'cli-table3';
import type { CostPresenter } from '../application/ports/cost-presenter.port.js';
import type { UsagePresenter } from '../application/ports/usage-presenter.port.js';
import type { CostRecord, UsageRecord } from '../domain/entities.js';

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function createTablePresenter(): UsagePresenter & CostPresenter {
  return {
    present(records: UsageRecord[] | CostRecord[]): void {
      if (records.length === 0) {
        console.log('No data found for the specified period.');
        return;
      }

      const first = records[0];
      if ('uncachedInputTokens' in first) {
        presentUsage(records as UsageRecord[]);
      } else {
        presentCost(records as CostRecord[]);
      }
    },

    presentSum(total: number, currency: string): void {
      console.log(`Total: $${total.toFixed(2)} ${currency}`);
    },
  };
}

function presentUsage(records: UsageRecord[]) {
  const table = new Table({
    head: [
      chalk.green('Date'),
      chalk.green('Model'),
      chalk.green('Input Tokens'),
      chalk.green('Cached Tokens'),
      chalk.green('Output Tokens'),
      chalk.green('Web Searches'),
    ],
  });

  for (const r of records) {
    table.push([
      chalk.dim(formatDate(r.date)),
      r.model ?? '-',
      String(r.uncachedInputTokens + r.cacheCreationTokens),
      String(r.cachedInputTokens),
      String(r.outputTokens),
      String(r.webSearchRequests),
    ]);
  }

  console.log(table.toString());
}

function presentCost(records: CostRecord[]) {
  const table = new Table({
    head: [
      chalk.green('Date'),
      chalk.green('Description'),
      chalk.green('Model'),
      chalk.green('Amount (USD)'),
      chalk.green('Token Type'),
      chalk.green('Tier'),
    ],
  });

  for (const r of records) {
    table.push([
      chalk.dim(formatDate(r.date)),
      (r.description ?? '-').slice(0, 40),
      r.model ?? '-',
      r.amountDollars.toFixed(4),
      r.tokenType ?? '-',
      r.serviceTier ?? '-',
    ]);
  }

  console.log(table.toString());
}
