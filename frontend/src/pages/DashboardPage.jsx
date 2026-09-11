import { useAuth } from '../hooks/useAuth';
import { AdminDashboard } from '../features/admin/AdminDashboard';
import { TeacherDashboard } from '../features/teacher/TeacherDashboard';
import { StudentDashboard } from '../features/student/StudentDashboard';
import { ROLES } from '../utils/constants';

export function DashboardPage() {
  const { role } = useAuth();

  if (role === ROLES.ADMIN) return <AdminDashboard />;
  if (role === ROLES.TEACHER) return <TeacherDashboard />;
  if (role === ROLES.STUDENT) return <StudentDashboard />;
  return null;
}
