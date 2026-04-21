import { allowInsecureTlsForDev, handleAuthLogin } from '../../server/gigachatProxy.js';

allowInsecureTlsForDev();

export default async function handler(request, response) {
  return handleAuthLogin(request, response);
}
