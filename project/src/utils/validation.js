export const required = (msg = 'This field is required') => ({
  required: msg,
});

export const email = (msg = 'Enter a valid email address') => ({
  required: 'Email is required',
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: msg },
});

export const minLen = (n, msg) => ({
  required: 'This field is required',
  minLength: { value: n, message: msg || `Must be at least ${n} characters` },
});

export const password = (msg = 'Password must be at least 8 characters') => ({
  required: 'Password is required',
  minLength: { value: 8, message: msg },
});
