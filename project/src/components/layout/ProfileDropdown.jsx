import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import Dropdown, { DropdownItem, DropdownDivider } from '@/components/common/Dropdown';
import Avatar from '@/components/common/Avatar';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { logout } from '@/redux/slices/authSlice';
import { ROLE_LABELS } from '@/constants/roles';

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Dropdown
      align="right"
      width="w-60"
      trigger={
        <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition hover:bg-gray-100 dark:hover:bg-navy-800" aria-label="Account menu">
          <Avatar name={user?.name} size="sm" color={user?.avatarColor} />
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-navy-900 dark:text-gray-100">{user?.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{ROLE_LABELS[user?.role] || user?.role}</p>
          </div>
          <ChevronDown size={15} className="text-gray-400" />
        </button>
      }
    >
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-navy-900 dark:text-gray-100">{user?.name}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
      </div>
      <DropdownDivider />
      <DropdownItem icon={UserIcon} onClick={() => navigate(`/${user?.role}/profile`)}>
        My Profile
      </DropdownItem>
      {user?.role === 'ceo' && (
        <DropdownItem icon={SettingsIcon} onClick={() => navigate('/ceo/settings')}>
          System Settings
        </DropdownItem>
      )}
      <DropdownDivider />
      <DropdownItem icon={LogOut} danger onClick={handleLogout}>
        Sign out
      </DropdownItem>
    </Dropdown>
  );
}
