import Avatar from './Avatar';
import Badge, { statusTone } from './Badge';

export default function ProfileCard({ user }) {
  if (!user) return null;
  return (
    <div className="card flex flex-col items-center p-6 text-center">
      <Avatar name={user.name} size="xl" color={user.avatarColor} ring />
      <h3 className="mt-3 text-base font-semibold text-navy-900 dark:text-gray-100">{user.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{user.title}</p>
      <div className="mt-2">
        <Badge tone="navy">{user.department}</Badge>
      </div>
      <div className="mt-4 w-full space-y-2 border-t border-gray-100 pt-4 text-left text-sm dark:border-navy-800">
        <Row label="Email" value={user.email} />
        <Row label="Role" value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'} />
        <Row label="Status" value={<Badge tone={statusTone(user.status)} dot>{user.status}</Badge>} />
        {user.joinedAt && <Row label="Joined" value={new Date(user.joinedAt).toLocaleDateString()} />}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-navy-800 dark:text-gray-200">{value}</span>
    </div>
  );
}
