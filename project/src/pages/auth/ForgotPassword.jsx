import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { forgotPassword } from '@/services/authService';
import { email } from '@/utils/validation';
import { ROUTES } from '@/constants/routes';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data);
      setSent(true);
      toast.success('Reset link sent');
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link to={ROUTES.LOGIN} className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-navy-700 dark:hover:text-gray-200">
        <ArrowLeft size={15} /> Back to sign in
      </Link>

      {sent ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-gray-100">Check your inbox</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">If an account exists for that email, a reset link is on its way.</p>
          <Button variant="secondary" className="mt-6" onClick={() => navigate(ROUTES.RESET_PASSWORD)}>
            Enter reset code
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-gray-100">Forgot your password?</h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@survitecxdahawi.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email', email())}
            />
            <Button type="submit" size="lg" loading={loading} iconRight={ArrowRight} className="w-full">
              Send reset link
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
