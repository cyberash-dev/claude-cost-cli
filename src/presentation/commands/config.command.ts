import type { Command } from 'commander';
import type { CredentialStore } from '../../application/ports/credential-store.port.js';
import { createRemoveApiKeyUseCase } from '../../application/use-cases/remove-api-key.use-case.js';
import { createShowApiKeyUseCase } from '../../application/use-cases/show-api-key.use-case.js';
import { createStoreApiKeyUseCase } from '../../application/use-cases/store-api-key.use-case.js';

export function registerConfigCommand(
  program: Command,
  credentialStore: CredentialStore,
): void {
  const config = program
    .command('config')
    .description('Manage API key storage');

  config
    .command('set-key')
    .description('Store Admin API key securely in macOS Keychain')
    .action(async () => {
      const { password } = await import('@inquirer/prompts');
      const storeApiKey = createStoreApiKeyUseCase(credentialStore);
      try {
        const key = await password({
          message: 'Enter your Admin API key (sk-ant-admin...):',
          mask: true,
          validate: (v) => (v.trim().length > 0 ? true : 'Key cannot be empty'),
        });
        await storeApiKey(key);
        console.log('API key stored successfully.');
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  config
    .command('show')
    .description('Display masked API key')
    .action(async () => {
      const showApiKey = createShowApiKeyUseCase(credentialStore);
      try {
        const masked = await showApiKey();
        console.log(masked);
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  config
    .command('remove-key')
    .description('Remove API key from Keychain')
    .action(async () => {
      const removeApiKey = createRemoveApiKeyUseCase(credentialStore);
      try {
        await removeApiKey();
        console.log('API key removed.');
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });
}
