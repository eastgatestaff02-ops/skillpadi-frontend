
import { authHandlers } from './auth';


import { employerAndApprenticeshipHandlers } from './employerAndApprenticeship';

// Export the full list
export const handlers = [
  ...authHandlers,
    ...employerAndApprenticeshipHandlers,
];