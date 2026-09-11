const stroke = { stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

export const IconGrid = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
);

export const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 4.6a3.2 3.2 0 0 1 0 6.2" />
    <path d="M15.5 14.2c2.6.4 4.7 2.4 5 5.8" />
  </svg>
);

export const IconChalkboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M9 20h6M12 16v4" />
  </svg>
);

export const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
    <path d="M4 18a2.5 2.5 0 0 1 2.5-2.5H20" />
  </svg>
);

export const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <rect x="9" y="2.5" width="6" height="3" rx="1" />
    <path d="M8.5 11h7M8.5 15h5" />
  </svg>
);

export const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <path d="m12 3 9 4.8-9 4.8-9-4.8L12 3Z" />
    <path d="m3 12.8 9 4.8 9-4.8" />
    <path d="m3 17.6 9 4.8 9-4.8" />
  </svg>
);

export const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const IconGraduationCap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" />
    <path d="M6.5 11.7V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.3" />
    <path d="M21 9.5V15" />
  </svg>
);

export const IconTrendUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
    <path d="M3 17 9.5 10.5 14 15l7-8" />
    <path d="M17 7h4v4" />
  </svg>
);

export const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...stroke}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...stroke}>
    <path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" />
  </svg>
);

export const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...stroke}>
    <path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m2 0-.7 12.1a2 2 0 0 1-2 1.9H9.7a2 2 0 0 1-2-1.9L7 7" />
  </svg>
);
