const DEFAULT_OAUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
const DEFAULT_API_BASE_URL = 'https://gigachat.devices.sberbank.ru/api/v1';

export function allowInsecureTlsForDev() {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowInsecureTls =
    process.env.GIGACHAT_INSECURE_TLS === 'true' ||
    (!isProduction && process.env.GIGACHAT_INSECURE_TLS !== 'false');

  if (allowInsecureTls) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  return allowInsecureTls;
}

function sendJsonError(response, status, message) {
  response.status(status).json({ error: message });
}

function readRequestBody(request) {
  if (!request.body) {
    return {};
  }

  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body);
    } catch {
      return {};
    }
  }

  if (Buffer.isBuffer(request.body)) {
    try {
      return JSON.parse(request.body.toString('utf-8'));
    } catch {
      return {};
    }
  }

  return request.body;
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    return data.message || data.error || `Ошибка ${response.status}`;
  } catch {
    return `Ошибка ${response.status}`;
  }
}

function getOauthUrl() {
  return process.env.GIGACHAT_OAUTH_URL ?? DEFAULT_OAUTH_URL;
}

function getApiBaseUrl() {
  return process.env.GIGACHAT_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

function resolveCredentials(rawCredentials) {
  const credentials = typeof rawCredentials === 'string' ? rawCredentials.trim() : '';
  return credentials || process.env.GIGACHAT_AUTH_KEY?.trim() || '';
}

function resolveScope(rawScope) {
  const scope = typeof rawScope === 'string' ? rawScope.trim() : '';
  return scope || process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';
}

export async function handleHealth(_request, response) {
  response.status(200).json({ ok: true });
}

export async function handleAuthLogin(request, response) {
  const { credentials: rawCredentials, scope: rawScope } = readRequestBody(request);
  const credentials = resolveCredentials(rawCredentials);
  const scope = resolveScope(rawScope);

  if (!credentials) {
    return sendJsonError(response, 400, 'Не передан Authorization Key и не настроен GIGACHAT_AUTH_KEY.');
  }

  try {
    const authResponse = await fetch(getOauthUrl(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        RqUID: crypto.randomUUID(),
      },
      body: new URLSearchParams({ scope }).toString(),
    });

    if (!authResponse.ok) {
      return sendJsonError(response, authResponse.status, await readErrorMessage(authResponse));
    }

    const data = await authResponse.json();

    return response.status(200).json({
      accessToken: data.access_token,
      expiresAt: data.expires_at,
    });
  } catch (error) {
    return sendJsonError(
      response,
      502,
      error instanceof Error ? error.message : 'Не удалось получить access token.',
    );
  }
}

export async function handleChatCompletions(request, response) {
  const { messages, model, stream = false, token } = readRequestBody(request);

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
    const apiResponse = await fetch(`${getApiBaseUrl()}/chat/completions`, {
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
      return sendJsonError(response, apiResponse.status, await readErrorMessage(apiResponse));
    }

    if (!stream) {
      const data = await apiResponse.json();
      const content = data.choices?.[0]?.message?.content ?? '';
      return response.status(200).json({ content });
    }

    if (!apiResponse.body || typeof response.write !== 'function') {
      return sendJsonError(response, 501, 'Streaming недоступен в текущем окружении.');
    }

    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');

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
  } catch (error) {
    return sendJsonError(
      response,
      502,
      error instanceof Error ? error.message : 'Не удалось получить ответ от GigaChat.',
    );
  }
}
