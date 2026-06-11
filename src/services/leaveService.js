import { LEAVE_APPLICATIONS } from '../data/leaveApplications.js';

let store = [...LEAVE_APPLICATIONS];

export const leaveService = {
  list: async () => store,
  setStatus: async (id, status) => {
    store = store.map((a) => (a.id === id ? { ...a, status } : a));
    return store;
  },
  pendingCount: async () => store.filter((a) => a.status === 'Pending').length,
};
