import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AdminCoursesEnterprisePage } from './pages/admin/AdminCoursesEnterprisePage';
import { AdminUsersEnterprisePage } from './pages/admin/AdminUsersEnterprisePage';
import { AdminDesignSystemPage } from './pages/admin/AdminDesignSystemPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyCoursesPage } from './pages/MyCoursesPage';

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Validando sessão...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const UserCoursesRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Validando sessão...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/cursos" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/cursos" element={<AdminRoute><AdminCoursesEnterprisePage /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><AdminUsersEnterprisePage /></AdminRoute>} />
        <Route path="/admin/design-system" element={<AdminRoute><AdminDesignSystemPage /></AdminRoute>} />
        <Route path="/meus-cursos" element={<UserCoursesRoute><MyCoursesPage /></UserCoursesRoute>} />
        <Route path="/cursos/:slug" element={<CourseDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/:publicId" element={<CheckoutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  </BrowserRouter>
);

export const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
