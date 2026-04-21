import { handleHealth } from '../server/gigachatProxy.js';

export default async function handler(request, response) {
  return handleHealth(request, response);
}
