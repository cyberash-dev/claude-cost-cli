import type { CredentialStore } from '../ports/credential-store.port.js';

export function createRemoveApiKeyUseCase(
  credentialStore: CredentialStore,
): () => Promise<void> {
  return async () => {
    await credentialStore.clear();
  };
}
