import { setupWorker } from 'msw';
// Import from the index file instead of directly from auth
import { handlers } from './handlers'; 

export const worker = setupWorker(...handlers);