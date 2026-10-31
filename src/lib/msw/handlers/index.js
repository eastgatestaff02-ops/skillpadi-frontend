
import { authHandlers } from './auth';


// Import Dev B's combined handlers
import { employerAndApprenticeshipHandlers } from './employerAndApprenticeship';

// Export the full list
export const handlers = [
  ...authHandlers,
    ...employerAndApprenticeshipHandlers,
];