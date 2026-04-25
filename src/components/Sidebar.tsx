import { NavLink } from 'react-router-dom';
import {
  Film,
  LayoutDashboard,
  // Calendar,
  // Users,
  // Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Film size={32} />
        <span>CineManager</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/movies" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Film size={20} />
          <span>Movies</span>
        </NavLink>
        {/*<NavLink to="/showtimes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>*/}
        {/*  <Calendar size={20} />*/}
        {/*  <span>Showtimes</span>*/}
        {/*</NavLink>*/}
        {/*<NavLink to="/staff" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>*/}
        {/*  <Users size={20} />*/}
        {/*  <span>Staff</span>*/}
        {/*</NavLink>*/}
        {/*<NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>*/}
        {/*  <Settings size={20} />*/}
        {/*  <span>Settings</span>*/}
        {/*</NavLink>*/}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
