import { isValidAdminKey } from '../date-range.helper.js';
import type { CredentialStore } from '../ports/credential-store.port.js';

export function createStoreApiKeyUseCase(
  credentialStore: CredentialStore,
): (key: string) => Promise<void> {
  return async (key: string) => {
    const trimmed = key.trim();
    if (!trimmed) throw new Error('API key cannot be empty');
    if (!isValidAdminKey(trimmed)) {
      throw new Error(
        'Invalid admin API key: must start with sk-ant-admin. Get your key from Claude Console → Settings → Admin Keys.',
      );
    }
    await credentialStore.save(trimmed);
  };
}
