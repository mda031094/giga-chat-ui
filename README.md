# GigaChat UI

Учебный интерфейс чата с GigaChat на React + TypeScript.

## Запуск

```bash
PATH="$PWD/.tools/node/bin:$PATH" npm install
PATH="$PWD/.tools/node/bin:$PATH" npm run dev:server
PATH="$PWD/.tools/node/bin:$PATH" npm run dev
```

## Тесты

```bash
PATH="$PWD/.tools/node/bin:$PATH" npm test
```

Что покрыто:
- unit-тесты для `chatReducer`
- тесты `InputArea`
- тесты `Message`
- тесты `Sidebar`
- тесты `localStorage`-персистентности
