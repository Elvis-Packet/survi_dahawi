import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User as UserIcon, Mail, Phone, MapPin, Building2, Briefcase } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Avatar from '@/components/common/Avatar';
import ProfileCard from '@/components/common/ProfileCard';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { updateCurrentUser } from '@/redux/slices/authSlice';
import { updateProfile } from '@/services/userService';
import { ROLE_LABELS } from '@/constants/roles';

export default function ProfilePage({ role }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      title: user?.title || '',
      location: user?.location || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
      dispatch(updateCurrentUser(data));
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your personal information and contact details."
        breadcrumbs={[{ label: 'Home', link: `/${role}/dashboard` }, { label: 'Profile' }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — summary card */}
        <div className="lg:col-span-1">
          <ProfileCard user={user} />
          <Card className="mt-4">
            <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Account</h3>
            <div className="space-y-3 text-sm">
              <InfoRow icon={Briefcase} label="Role" value={ROLE_LABELS[user?.role]} />
              <InfoRow icon={Building2} label="Department" value={user?.department} />
              <InfoRow icon={UserIcon} label="Manager" value={user?.managerName || '—'} />
            </div>
          </Card>
        </div>

        {/* Right — edit form */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">Personal information</h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Update your details. Changes are saved to your profile.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" icon={UserIcon} error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
                <Input label="Email" type="email" icon={Mail} error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
                <Input label="Phone" icon={Phone} {...register('phone')} />
                <Input label="Job title" icon={Briefcase} {...register('title')} />
                <Input label="Location" icon={MapPin} {...register('location')} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => window.location.reload()}>Cancel</Button>
                <Button type="submit" loading={loading}>Save changes</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Icon size={15} /> {label}
      </span>
      <span className="font-medium text-navy-800 dark:text-gray-200">{value}</span>
    </div>
  );
}
