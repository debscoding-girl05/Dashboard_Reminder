import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Boutiques } from './pages/Boutiques';
import { Clients } from './pages/Clients';
import { Subscriptions } from './pages/Subscriptions';
import { Reminders } from './pages/Reminders';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/boutiques" replace />} />
          <Route path="boutiques" element={<Boutiques />} />
          <Route path="clients" element={<Clients />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="reminders" element={<Reminders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;