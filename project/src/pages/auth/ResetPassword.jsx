import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { resetPassword } from '@/services/authService';
import { minLen } from '@/utils/validation';
import { ROUTES } from '@/constants/routes';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const pwd = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPassword(data);
      toast.success('Password reset successfully');
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error('Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link to={ROUTES.LOGIN} className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-navy-700 dark:hover:text-gray-200">
        <ArrowLeft size={15} /> Back to sign in
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-gray-100">Set a new password</h1>
      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Choose a strong password you haven't used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input label="Reset token" placeholder="Enter the token from your email" error={errors.token?.message} {...register('token', { required: 'Token is required' })} />
        <Input label="New password" type="password" placeholder="••••••••" icon={Lock} error={errors.password?.message} {...register('password', minLen(8))} />
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.confirm?.message}
          {...register('confirm', {
            validate: (v) => v === pwd || 'Passwords do not match',
          })}
        />
        <Button type="submit" size="lg" loading={loading} iconRight={ArrowRight} className="w-full">
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}
