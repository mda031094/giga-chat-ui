import type { ChatMessage, ChatRole, ChatScope } from '../types';

const BACKEND_API_BASE = import.meta.env.VITE_BACKEND_API_BASE ?? '/api';

type AccessTokenResponse = {
  accessToken: string;
  expiresAt: number;
};

type ChatCompletionPayload = {
  messages: Pick<ChatMessage, 'role' | 'content'>[];
  model: string;
  signal?: AbortSignal;
  stream?: boolean;
  onDelta?: (chunk: string) => void;
  token: string;
};

type GigachatErrorResponse = {
  message?: string;
  error?: string;
};

export type GigachatAuthResult = {
  accessToken: string;
  expiresAt: number;
};

function isSupportedRole(role: ChatRole): role is 'system' | 'user' | 'assistant' {
  return role === 'system' || role === 'user' || role === 'assistant';
}

function toApiMessages(messages: Pick<ChatMessage, 'role' | 'content'>[]) {
  return messages
    .filter((message) => isSupportedRole(message.role))
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

async function readErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as GigachatErrorResponse;
    return data.message || data.error || `Ошибка ${response.status}`;
  } catch {
    return `Ошибка ${response.status}`;
  }
}

export async function requestAccessToken(credentials: string, scope: ChatScope) {
  const response = await fetch(`${BACKEND_API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      credentials,
      scope,
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data = (await response.json()) as AccessTokenResponse;

  return {
    accessToken: data.accessToken,
    expiresAt: data.expiresAt,
  } satisfies GigachatAuthResult;
}

async function createRestCompletion({ messages, model, signal, token }: ChatCompletionPayload) {
  const response = await fetch(`${BACKEND_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: toApiMessages(messages),
      model,
      stream: false,
      token,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data = (await response.json()) as {
    content?: string;
  };

  return data.content ?? '';
}

async function createStreamingCompletion({ messages, model, onDelta, signal, token }: ChatCompletionPayload) {
  const response = await fetch(`${BACKEND_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: toApiMessages(messages),
      model,
      stream: true,
      token,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (!response.body) {
    return createRestCompletion({ messages, model, signal, token });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const payload = event
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .join('\n');

      if (!payload || payload === '[DONE]') {
        continue;
      }

      const data = JSON.parse(payload) as {
        choices?: Array<{
          delta?: {
            content?: string;
          };
        }>;
      };

      const chunk = data.choices?.[0]?.delta?.content ?? '';
      if (!chunk) {
        continue;
      }

      result += chunk;
      onDelta?.(chunk);
    }
  }

  return result;
}

export async function createChatCompletion(payload: ChatCompletionPayload) {
  if (!payload.stream) {
    return createRestCompletion(payload);
  }

  try {
    return await createStreamingCompletion(payload);
  } catch (error) {
    if (payload.signal?.aborted) {
      throw error;
    }

    return createRestCompletion({ ...payload, stream: false });
  }
}
