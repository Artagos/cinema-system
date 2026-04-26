/**
 * Sidebar Compound Component Pattern
 * 
 * Provides flexible navigation composition while managing active state context.
 * 
 * Usage with default layout:
 * <SidebarCompound>
 *   <SidebarCompound.Logo icon={Film}>CineManager</SidebarCompound.Logo>
 *   <SidebarCompound.Nav>
 *     <SidebarCompound.Link to="/dashboard" icon={LayoutDashboard}>Dashboard</SidebarCompound.Link>
 *     <SidebarCompound.Link to="/movies" icon={Film}>Movies</SidebarCompound.Link>
 *   </SidebarCompound.Nav>
 *   <SidebarCompound.Footer>
 *     <SidebarCompound.Action onClick={onLogout} icon={LogOut}>Logout</SidebarCompound.Action>
 *   </SidebarCompound.Footer>
 * </SidebarCompound>
 * 
 * The compound pattern allows consumers to:
 * - Reorder sections freely
 * - Add custom sections without prop drilling
 * - Control layout while sidebar handles active state
 */

import { createContext, useContext, type ReactNode } from 'react';
import { NavLink, type NavLinkProps } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

// --- Context for sharing sidebar state ---
interface SidebarContextValue {
  isCollapsed: boolean;
}

const SidebarContext = createContext<SidebarContextValue>({ isCollapsed: false });

function useSidebar() {
  return useContext(SidebarContext);
}

// --- Main Component ---

interface SidebarCompoundProps {
  children: ReactNode;
  isCollapsed?: boolean;
  className?: string;
}

function SidebarRoot({ children, isCollapsed = false, className }: SidebarCompoundProps) {
  const value: SidebarContextValue = { isCollapsed };

  return (
    <SidebarContext.Provider value={value}>
      <aside className={`sidebar ${className ?? ''}`}>
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

// --- Sub-components ---

interface LogoProps {
  icon: LucideIcon;
  children: ReactNode;
}

function SidebarLogo({ icon: Icon, children }: LogoProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="sidebar-header">
      <Icon size={32} />
      {!isCollapsed && <span>{children}</span>}
    </div>
  );
}

interface NavProps {
  children: ReactNode;
}

function SidebarNav({ children }: NavProps) {
  return <nav className="sidebar-nav">{children}</nav>;
}

interface LinkProps extends Omit<NavLinkProps, 'className'> {
  icon: LucideIcon;
  children: ReactNode;
}

function SidebarLink({ icon: Icon, children, ...props }: LinkProps) {
  const { isCollapsed } = useSidebar();

  return (
    <NavLink
      {...props}
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{children}</span>}
    </NavLink>
  );
}

interface FooterProps {
  children: ReactNode;
}

function SidebarFooter({ children }: FooterProps) {
  return <div className="sidebar-footer">{children}</div>;
}

interface ActionProps {
  icon: LucideIcon;
  children: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

function SidebarAction({ icon: Icon, children, onClick, variant = 'default' }: ActionProps) {
  const { isCollapsed } = useSidebar();

  return (
    <button
      onClick={onClick}
      className={`sidebar-action ${variant === 'danger' ? 'logout-button' : ''}`}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{children}</span>}
    </button>
  );
}

interface SectionProps {
  title?: string;
  children: ReactNode;
}

function SidebarSection({ title, children }: SectionProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="sidebar-section">
      {title && !isCollapsed && (
        <h4 className="sidebar-section-title">{title}</h4>
      )}
      {children}
    </div>
  );
}

// --- Attach sub-components ---

Object.assign(SidebarRoot, {
  Logo: SidebarLogo,
  Nav: SidebarNav,
  Link: SidebarLink,
  Footer: SidebarFooter,
  Action: SidebarAction,
  Section: SidebarSection,
});

export const SidebarCompound = SidebarRoot;
export default SidebarRoot;
