import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8787);

const OAUTH_URL = process.env.GIGACHAT_OAUTH_URL ?? 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
const API_BASE_URL = process.env.GIGACHAT_API_BASE_URL ?? 'https://gigachat.devices.sberbank.ru/api/v1';
const allowInsecureTls = process.env.GIGACHAT_INSECURE_TLS !== 'false';

if (allowInsecureTls) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

app.use(express.json({ limit: '2mb' }));

app.use((request, _response, next) => {
  console.log(`[proxy] ${request.method} ${request.path}`);
  next();
});

function sendJsonError(response, status, message) {
  response.status(status).json({ error: message });
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    return data.message || data.error || `Ошибка ${response.status}`;
  } catch {
    return `Ошибка ${response.status}`;
  }
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/api/auth/login', async (request, response) => {
  const { credentials, scope } = request.body ?? {};

  if (!credentials || typeof credentials !== 'string') {
    return sendJsonError(response, 400, 'Не передан Authorization Key.');
  }

  if (!scope || typeof scope !== 'string') {
    return sendJsonError(response, 400, 'Не передан scope.');
  }

  try {
    console.log(`[proxy] auth login requested for scope=${scope}`);

    const authResponse = await fetch(OAUTH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${credentials.trim()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        RqUID: crypto.randomUUID(),
      },
      body: new URLSearchParams({ scope }).toString(),
    });

    if (!authResponse.ok) {
      const message = await readErrorMessage(authResponse);
      console.error(`[proxy] auth login failed: ${authResponse.status} ${message}`);
      return sendJsonError(response, authResponse.status, message);
    }

    const data = await authResponse.json();

    return response.json({
      accessToken: data.access_token,
      expiresAt: data.expires_at,
    });
  } catch (error) {
    console.error('[proxy] auth login network error:', error);
    return sendJsonError(
      response,
      502,
      error instanceof Error ? error.message : 'Не удалось получить access token.',
    );
  }
});

app.post('/api/chat/completions', async (request, response) => {
  const { messages, model, stream = false, token } = request.body ?? {};

  if (!token || typeof token !== 'string') {
    return sendJsonError(response, 400, 'Не передан access token.');
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return sendJsonError(response, 400, 'Не передан контекст messages.');
  }

  if (!model || typeof model !== 'string') {
    return sendJsonError(response, 400, 'Не передана модель.');
  }

  try {
    console.log(`[proxy] chat completions requested, stream=${String(stream)}`);

    const apiResponse = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Accept: stream ? 'text/event-stream' : 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        stream,
      }),
    });

    if (!apiResponse.ok) {
      const message = await readErrorMessage(apiResponse);
      console.error(`[proxy] chat completions failed: ${apiResponse.status} ${message}`);
      return sendJsonError(response, apiResponse.status, message);
    }

    if (stream) {
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');
      response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');

      if (!apiResponse.body) {
        response.end();
        return;
      }

      const reader = apiResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        response.write(decoder.decode(value, { stream: true }));
      }

      response.end();
      return;
    }

    const data = await apiResponse.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    response.json({ content });
  } catch (error) {
    console.error('[proxy] chat completions network error:', error);
    return sendJsonError(
      response,
      502,
      error instanceof Error ? error.message : 'Не удалось получить ответ от GigaChat.',
    );
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`GigaChat proxy listening on http://127.0.0.1:${port}`);
  console.log(`[proxy] insecure TLS mode: ${allowInsecureTls ? 'enabled' : 'disabled'}`);
});
