export function setupDemoAccount() {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV === 'production') return;

  const existing = localStorage.getItem('auth_users');
  if (existing && JSON.parse(existing).length > 0) {
    return; // Already set up
  }

  const demoUsers = [
    {
      id: 'user_demo',
      email: 'demo@example.com',
      password: 'password123',
      name: 'Demo User',
      createdAt: new Date(),
    },
    {
      id: 'user_admin',
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      createdAt: new Date(),
    },
  ];

  localStorage.setItem('auth_users', JSON.stringify(demoUsers));
}
