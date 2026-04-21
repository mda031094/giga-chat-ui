import { allowInsecureTlsForDev, handleChatCompletions } from '../../server/gigachatProxy.js';

allowInsecureTlsForDev();

export default async function handler(request, response) {
  return handleChatCompletions(request, response);
}
