import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useChat } from '../providers/ChatProvider';

const AuthPage = lazy(() => import('../../pages/AuthPage'));
const HomePage = lazy(() => import('../../pages/HomePage'));
const ChatPage = lazy(() => import('../../pages/ChatPage'));

function RouteFallback() {
  return <div className="route-fallback">Загружаем интерфейс…</div>;
}

export function AppRoutes() {
  const { state } = useChat();

  if (!state.auth.isAuthorized) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <AuthPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Suspense>
  );
}
