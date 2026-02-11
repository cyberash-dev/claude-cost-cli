import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { CredentialStore } from '../application/ports/credential-store.port.js';

const execFileAsync = promisify(execFile);

const SERVICE = 'claude-cost-cli';
const ACCOUNT = 'claude-cost-cli';

export function createKeychainCredentialStore(): CredentialStore {
  return {
    async save(credential: string) {
      try {
        await execFileAsync('security', [
          'add-generic-password',
          '-a',
          ACCOUNT,
          '-s',
          SERVICE,
          '-w',
          credential,
          '-U',
        ]);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('already exists')) {
          await execFileAsync('security', [
            'delete-generic-password',
            '-a',
            ACCOUNT,
            '-s',
            SERVICE,
          ]);
          await this.save(credential);
        } else {
          throw new Error(`Failed to store credential in Keychain: ${message}`);
        }
      }
    },

    async load() {
      try {
        const { stdout } = await execFileAsync('security', [
          'find-generic-password',
          '-a',
          ACCOUNT,
          '-s',
          SERVICE,
          '-w',
        ]);
        return stdout.trim();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (
          message.includes('could not be found') ||
          message.includes('The specified item could not be found')
        ) {
          throw new Error('No API key stored. Run: claude-cost config set-key');
        }
        throw new Error(
          `Failed to retrieve credential from Keychain: ${message}`,
        );
      }
    },

    async clear() {
      try {
        await execFileAsync('security', [
          'delete-generic-password',
          '-a',
          ACCOUNT,
          '-s',
          SERVICE,
        ]);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (
          !message.includes('could not be found') &&
          !message.includes('The specified item could not be found')
        ) {
          throw new Error(
            `Failed to remove credential from Keychain: ${message}`,
          );
        }
      }
    },
  };
}
