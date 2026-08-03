import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, Lock, ArrowRight, Hexagon } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setCredentials, setAuthStatus, setAuthError } from '@/redux/slices/authSlice';
import { login as loginService } from '@/services/authService';
import { email, password } from '@/utils/validation';
import { ROLE_DASHBOARD, ROUTES } from '@/constants/routes';
import { DEMO_ACCOUNTS } from '@/data/users';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    dispatch(setAuthStatus('loading'));
    try {
      const res = await loginService(data);
      dispatch(setCredentials(res.data));
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}`);
      navigate(ROLE_DASHBOARD[res.data.user.role] || ROUTES.STAFF_DASHBOARD);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      dispatch(setAuthError(msg));
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acct) => {
    setValue('email', acct.email, { shouldValidate: true });
    setValue('password', acct.password, { shouldValidate: true });
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
          <Hexagon size={18} />
        </div>
        <p className="text-sm font-bold text-navy-900 dark:text-gray-100">SurvitecXDahawi Brainstomers</p>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-gray-100">Sign in to your account</h1>
      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access the workspace.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@survitecxdahawi.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email', email())}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register('password', password())}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500 dark:border-navy-600 dark:bg-navy-800" />
            Remember me
          </label>
          <Link to={ROUTES.FORGOT_PASSWORD} className="font-medium text-navy-600 hover:text-navy-800 dark:text-navy-300">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" loading={loading} iconRight={ArrowRight} className="w-full">
          Sign in
        </Button>
      </form>

      {/* Demo accounts */}
      <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-4 dark:border-navy-700">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Demo accounts</p>
        <div className="space-y-1.5">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              onClick={() => fillDemo(a)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition hover:bg-gray-50 dark:hover:bg-navy-800"
            >
              <span className="font-medium text-navy-800 capitalize dark:text-gray-200">{a.role}</span>
              <span className="text-gray-500 dark:text-gray-400">{a.email}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-gray-400">Password for all: <span className="font-mono">password123</span></p>
      </div>
    </AuthLayout>
  );
}
