import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allowInsecureTlsForDev, handleAuthLogin, handleChatCompletions, handleHealth } from './gigachatProxy.js';

const app = express();
const port = Number(process.env.PORT || 8787);
const allowInsecureTls = allowInsecureTlsForDev();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

app.use(express.json({ limit: '2mb' }));

app.use((request, _response, next) => {
  console.log(`[proxy] ${request.method} ${request.path}`);
  next();
});

app.get('/api/health', handleHealth);
app.post('/api/auth/login', handleAuthLogin);
app.post('/api/chat/completions', handleChatCompletions);

app.use(express.static(distPath));

app.use((request, response, next) => {
  if (request.path.startsWith('/api/')) {
    next();
    return;
  }

  response.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`GigaChat proxy listening on http://0.0.0.0:${port}`);
  console.log(`[proxy] insecure TLS mode: ${allowInsecureTls ? 'enabled' : 'disabled'}`);
});
