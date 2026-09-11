import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { StudentsPage } from '../features/students/StudentsPage';
import { TeachersPage } from '../features/teachers/TeachersPage';
import { CoursesPage } from '../features/courses/CoursesPage';
import { EnrollmentsPage } from '../features/enrollments/EnrollmentsPage';
import { MyGradesPage } from '../features/grades/MyGradesPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ROLES } from '../utils/constants';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <TeachersPage />
            </ProtectedRoute>
          }
        />

        <Route path="/courses" element={<CoursesPage />} />

        <Route
          path="/enrollments"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
              <EnrollmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grades"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <MyGradesPage />
            </ProtectedRoute>
          }
        />

        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
