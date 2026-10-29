
import { authHandlers } from './auth';

import { workerHandlers } from './worker'; 

// Import Dev B's combined handlers
import { employerAndApprenticeshipHandlers } from './employerAndApprenticeship';

// Export the full list
export const handlers = [
  ...authHandlers,
  ...workerHandlers,
  ...employerAndApprenticeshipHandlers,
];