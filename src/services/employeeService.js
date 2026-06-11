/* Service layer — currently sourced from in-memory mock data, but the
   interface (Promise-based) is API-ready so swapping to fetch() is trivial. */

import { EMPLOYEES } from '../data/employees.js';

export const employeeService = {
  list: async () => EMPLOYEES,
  getById: async (id) => EMPLOYEES.find((e) => String(e.id) === String(id)) ?? null,
  countActive: async () => EMPLOYEES.filter((e) => e.status === 'Active').length,
};
