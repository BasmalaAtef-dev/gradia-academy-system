import { IconGrid, IconUsers, IconChalkboard, IconBook, IconClipboard, IconUser } from '../ui/icons';
import { ROLES } from '../../utils/constants';

export const NAV_BY_ROLE = {
  [ROLES.ADMIN]: [
    { to: '/dashboard', label: 'Dashboard', icon: IconGrid },
    { to: '/students', label: 'Students', icon: IconUsers },
    { to: '/teachers', label: 'Teachers', icon: IconChalkboard },
    { to: '/courses', label: 'Courses', icon: IconBook },
    { to: '/enrollments', label: 'Enrollments', icon: IconClipboard },
  ],
  [ROLES.TEACHER]: [
    { to: '/dashboard', label: 'Dashboard', icon: IconGrid },
    { to: '/courses', label: 'My Courses', icon: IconBook },
    { to: '/students', label: 'Students', icon: IconUsers },
    { to: '/enrollments', label: 'Grades', icon: IconClipboard },
  ],
  [ROLES.STUDENT]: [
    { to: '/dashboard', label: 'Dashboard', icon: IconGrid },
    { to: '/courses', label: 'My Courses', icon: IconBook },
    { to: '/grades', label: 'My Grades', icon: IconClipboard },
  ],
};

export const SETTINGS_NAV = { to: '/profile', label: 'Profile', icon: IconUser };
