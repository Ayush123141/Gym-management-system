import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  CreditCard, 
  UserSquare2, 
  MapPin, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
      ${isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className="transition-transform group-hover:scale-110" />
      <span className="font-medium">{label}</span>
    </div>
    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="w-72 h-screen sticky top-0 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
          <span className="text-white font-bold text-xl">G</span>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          GymForce
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem to="/members" icon={Users} label="Members" />
        <SidebarItem to="/plans" icon={ClipboardList} label="Plans" />
        <SidebarItem to="/payments" icon={CreditCard} label="Payments" />
        <SidebarItem to="/trainers" icon={UserSquare2} label="Trainers" />
        <SidebarItem to="/locations" icon={MapPin} label="Locations" />
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <SidebarItem to="/settings" icon={Settings} label="Settings" />
        <button className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
