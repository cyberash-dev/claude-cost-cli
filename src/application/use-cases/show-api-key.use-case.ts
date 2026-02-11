import { maskApiKey } from '../date-range.helper.js';
import type { CredentialStore } from '../ports/credential-store.port.js';

export function createShowApiKeyUseCase(
  credentialStore: CredentialStore,
): () => Promise<string> {
  return async () => {
    const key = await credentialStore.load();
    return maskApiKey(key);
  };
}
