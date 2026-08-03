import axiosClient from './axios';
import { MOCK_USERS, DEMO_ACCOUNTS } from '@/data/users';

// TODO:
// Connect Flask Backend — POST /api/auth/login
// Expected response: { token, user: { id, name, email, role, ... } }
export const login = async (data) => {
  // return axiosClient.post('/auth/login', data);

  // --- Mock implementation (remove when backend is ready) ---
  await new Promise((r) => setTimeout(r, 650));
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email === data.email && a.password === data.password
  );
  if (!account) {
    const err = new Error('Invalid email or password');
    err.response = { status: 401, data: { message: 'Invalid email or password' } };
    throw err;
  }
  const user = MOCK_USERS.find((u) => u.email === account.email);
  return {
    data: {
      token: `mock.jwt.${user.role}.${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        department: user.department,
        departmentId: user.departmentId,
        avatarColor: user.avatarColor,
        managerId: user.managerId,
      },
    },
  };
};

// TODO:
// Connect Flask Backend — POST /api/auth/forgot-password
export const forgotPassword = async (data) => {
  // return axiosClient.post('/auth/forgot-password', data);

  await new Promise((r) => setTimeout(r, 700));
  return { data: { message: 'If that email exists, a reset link has been sent.' } };
};

// TODO:
// Connect Flask Backend — POST /api/auth/reset-password
export const resetPassword = async (data) => {
  // return axiosClient.post('/auth/reset-password', data);

  await new Promise((r) => setTimeout(r, 700));
  return { data: { message: 'Password reset successfully.' } };
};

// TODO:
// Connect Flask Backend — POST /api/auth/logout
export const logout = async () => {
  // return axiosClient.post('/auth/logout');

  await new Promise((r) => setTimeout(r, 200));
  return { data: { message: 'Logged out' } };
};

// TODO:
// Connect Flask Backend — GET /api/auth/me
export const getMe = async () => {
  // return axiosClient.get('/auth/me');
  return { data: { user: MOCK_USERS[0] } };
};
