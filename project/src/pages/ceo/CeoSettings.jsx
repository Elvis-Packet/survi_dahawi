import { useState } from 'react';
import { toast } from 'react-toastify';
import { Settings as SettingsIcon, Shield, Bell, Globe, Lock, Mail } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { cn } from '@/utils/cn';

export default function CeoSettings() {
  const [tab, setTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { key: 'general', label: 'General', icon: SettingsIcon },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const save = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Settings saved'); }, 600);
  };

  return (
    <div>
      <PageHeader
        title="System Settings"
        description="Configure organization-wide preferences and policies."
        breadcrumbs={[{ label: 'Home', link: '/ceo/dashboard' }, { label: 'Settings' }]}
        actions={<Button size="sm" loading={saving} onClick={save}>Save changes</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Tabs */}
        <Card className="h-fit p-2 lg:col-span-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn('flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                tab === t.key ? 'bg-navy-900 text-white dark:bg-navy-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-800')}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {tab === 'general' && (
            <Card>
              <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">General settings</h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Organization name, locale, and defaults.</p>
              <div className="mt-5 space-y-4">
                <Input label="Organization name" defaultValue="Vertex Financial" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="Default language" options={[{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }]} placeholder="English" />
                  <Select label="Timezone" options={[{ value: 'pst', label: 'Pacific (PST)' }, { value: 'est', label: 'Eastern (EST)' }, { value: 'utc', label: 'UTC' }]} placeholder="Pacific (PST)" />
                </div>
                <Input label="Fiscal year start" type="date" defaultValue="2026-01-01" />
              </div>
            </Card>
          )}

          {tab === 'security' && (
            <Card>
              <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">Security policies</h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Password, session, and access controls.</p>
              <div className="mt-5 space-y-4">
                <ToggleRow icon={Lock} title="Enforce MFA" desc="Require multi-factor authentication for all users." defaultOn />
                <ToggleRow icon={Shield} title="IP allowlisting" desc="Restrict access to known office IP ranges." />
                <ToggleRow icon={Globe} title="Geo-fencing" desc="Block logins from unauthorized regions." defaultOn />
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <Select label="Password rotation" options={[{ value: '30', label: 'Every 30 days' }, { value: '60', label: 'Every 60 days' }, { value: '90', label: 'Every 90 days' }]} placeholder="Every 90 days" />
                  <Select label="Session timeout" options={[{ value: '15', label: '15 minutes' }, { value: '30', label: '30 minutes' }, { value: '60', label: '1 hour' }]} placeholder="30 minutes" />
                </div>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">Notification preferences</h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Control which alerts are sent organization-wide.</p>
              <div className="mt-5 space-y-4">
                <ToggleRow icon={Bell} title="Task assignments" desc="Notify employees when tasks are assigned." defaultOn />
                <ToggleRow icon={Mail} title="Weekly digest" desc="Send a weekly performance summary to managers." defaultOn />
                <ToggleRow icon={Shield} title="Security alerts" desc="Email admins on failed login attempts." defaultOn />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, title, desc, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-navy-800">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-800"><Icon size={16} className="text-gray-500" /></div>
        <div><p className="text-sm font-medium text-navy-900 dark:text-gray-100">{title}</p><p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p></div>
      </div>
      <button onClick={() => setOn(!on)} className={cn('relative h-6 w-11 rounded-full transition', on ? 'bg-navy-600' : 'bg-gray-300 dark:bg-navy-700')} role="switch" aria-checked={on}>
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition', on ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  );
}
