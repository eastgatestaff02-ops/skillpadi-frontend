import { authHandlers } from './auth';
import { catalogHandlers } from './catalog';
import { workerHandlers } from './workers';
import { employerHandlers } from './employer';
import { apprenticeshipHandlers } from './apprenticeship';

export const handlers = [
  ...authHandlers,
  ...catalogHandlers,
  ...workerHandlers,
  ...employerHandlers,
  ...apprenticeshipHandlers,
];