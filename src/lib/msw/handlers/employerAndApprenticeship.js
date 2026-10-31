import { employerHandlers } from './employer';
import { apprenticeshipHandlers } from './apprenticeship';

export const employerAndApprenticeshipHandlers = [
  ...employerHandlers,
  ...apprenticeshipHandlers,
];