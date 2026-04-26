import { Film, LayoutDashboard, LogOut } from 'lucide-react';
import { SidebarCompound } from './compound/SidebarCompound';

interface SidebarProps {
  onLogout: () => void;
}

/**
 * Sidebar - Uses compound component pattern
 * SidebarCompound provides context for shared state
 * Layout is controlled here, not buried in props
 */
export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <SidebarCompound>
      <SidebarCompound.Logo icon={Film}>CineManager</SidebarCompound.Logo>

      <SidebarCompound.Nav>
        <SidebarCompound.Link to="/dashboard" icon={LayoutDashboard}>
          Dashboard
        </SidebarCompound.Link>
        <SidebarCompound.Link to="/movies" icon={Film}>
          Movies
        </SidebarCompound.Link>
      </SidebarCompound.Nav>

      <SidebarCompound.Footer>
        <SidebarCompound.Action
          icon={LogOut}
          onClick={onLogout}
          variant="danger"
        >
          Logout
        </SidebarCompound.Action>
      </SidebarCompound.Footer>
    </SidebarCompound>
  );
}
