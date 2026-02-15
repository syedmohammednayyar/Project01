
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  user: User;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, user }) => {
  return (
    <header className="h-16 bg-surface border-b border-secondary/20 flex items-center justify-between px-6 z-10 flex-shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-text-secondary hover:text-primary transition-colors">
          <span className="material-icons">menu</span>
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-lg">search</span>
          <input 
            type="text" 
            placeholder="Search IMEI, Orders, Customers..." 
            className="w-full bg-background border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary text-text-dark transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2 text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-background">
          <span className="material-icons">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>
        
        <div className="h-8 w-px bg-secondary/20 mx-1 md:mx-2"></div>
        
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-all">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;