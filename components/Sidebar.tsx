
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, user, onLogout }) => {
  const location = useLocation();

  const allMenuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard', section: 'Main', roles: ['Admin', 'Staff'] },
    { label: 'POS Terminal', icon: 'point_of_sale', path: '/pos', section: 'Main', roles: ['Admin', 'Staff'] },
    { label: 'Sales History', icon: 'receipt_long', path: '/sales', section: 'Main', roles: ['Admin', 'Staff'] },
    { label: 'Inventory', icon: 'inventory_2', path: '/inventory', section: 'Main', roles: ['Admin'] },
    { label: 'Repair Services', icon: 'build', path: '/repairs', section: 'Main', roles: ['Admin', 'Staff'] },
    { label: 'Accessories', icon: 'extension', path: '/accessories', section: 'Management', roles: ['Admin', 'Staff'] },
    { label: 'Customers', icon: 'people', path: '/customers', section: 'Management', roles: ['Admin'] },
    { label: 'Expenses', icon: 'receipt', path: '/expenses', section: 'Finance', roles: ['Admin'] },
    { label: 'Payments & Dues', icon: 'account_balance_wallet', path: '/payments', section: 'Finance', roles: ['Admin'] },
    { label: 'Reports', icon: 'bar_chart', path: '/reports', section: 'System', roles: ['Admin'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user.role));
  const sections = [...new Set(menuItems.map(item => item.section))];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-0'} bg-surface text-text-secondary flex flex-col transition-all duration-300 h-full overflow-hidden z-20 border-r border-secondary/20`}>
      <div className="h-16 flex items-center px-6 border-b border-secondary/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-icons text-white text-sm">smartphone</span>
          </div>
          <span className="text-text-dark font-bold text-lg tracking-tight whitespace-nowrap">MobMastery</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {sections.map(section => (
          <div key={section}>
            <p className="px-3 text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">{section}</p>
            <div className="space-y-1">
              {menuItems.filter(item => item.section === section).map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary text-white shadow-lg' : 'hover:bg-background hover:text-text-dark'
                    }`}
                  >
                    <span className={`material-icons text-[20px] ${isActive ? 'text-white' : 'text-text-secondary'}`}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-secondary/20 flex-shrink-0">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3 min-w-0">
             <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
               {user.name.charAt(0)}
             </div>
             <div className="min-w-0">
               <p className="text-sm font-semibold text-text-dark truncate">{user.name}</p>
               <p className="text-xs text-text-secondary truncate">{user.role === 'Admin' ? 'Administrator' : 'Store Staff'}</p>
             </div>
          </div>
          <button onClick={onLogout} title="Logout" className="p-2 text-text-secondary hover:text-error rounded-full hover:bg-error/10 transition-colors">
            <span className="material-icons">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;