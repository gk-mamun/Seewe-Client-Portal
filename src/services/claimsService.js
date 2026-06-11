import { CLAIMS } from '../data/claims.js';

let store = [...CLAIMS];

export const claimsService = {
  list: async () => store,
  setStatus: async (id, status) => {
    store = store.map((c) => (c.id === id ? { ...c, status } : c));
    return store;
  },
  pendingCount: async () => store.filter((c) => c.status === 'Pending').length,
};
