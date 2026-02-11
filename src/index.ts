#!/usr/bin/env node

import { Command } from 'commander';
import { createAnthropicCostRepository } from './infrastructure/anthropic-cost-repository.js';
import { createAnthropicUsageRepository } from './infrastructure/anthropic-usage-repository.js';
import { createJsonPresenter } from './infrastructure/json-presenter.js';
import { createKeychainCredentialStore } from './infrastructure/keychain-credential-store.js';
import { createTablePresenter } from './infrastructure/table-presenter.js';
import { registerConfigCommand } from './presentation/commands/config.command.js';
import { registerCostCommand } from './presentation/commands/cost.command.js';
import { registerUsageCommand } from './presentation/commands/usage.command.js';

const credentialStore = createKeychainCredentialStore();
const usageRepository = createAnthropicUsageRepository(() =>
  credentialStore.load(),
);
const costRepository = createAnthropicCostRepository(() =>
  credentialStore.load(),
);

const getPresenter = (json: boolean) =>
  json ? createJsonPresenter() : createTablePresenter();

const program = new Command();
program
  .name('claude-usage')
  .description('CLI for Claude API usage and cost reports')
  .version('1.0.0');

registerConfigCommand(program, credentialStore);
registerCostCommand(program, costRepository, getPresenter);
registerUsageCommand(program, usageRepository, getPresenter);

program.parse();
