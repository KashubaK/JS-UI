export function getInitialElementStore(overrides: Partial<ElementDataStore> = {}): ElementDataStore {
  return {
    position: -1,
    subscribable: undefined,
    ...overrides,
  }
}