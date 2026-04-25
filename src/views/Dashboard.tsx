import { useAuth } from '../contexts/AuthContext';
import { Film, Calendar, Users } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { PageHeader } from '../components/PageHeader';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <Sidebar onLogout={logout} />

      <main className="main-content">
        <PageHeader
          title={`Welcome back, ${user?.firstName}!`}
          subtitle={user?.role || ''}
          userEmail={user?.email}
        />

        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Active Movies</h3>
            <p className="stat-value">12</p>
          </div>
          <div className="stat-card">
            <h3>Today's Showtimes</h3>
            <p className="stat-value">24</p>
          </div>
          <div className="stat-card">
            <h3>Tickets Sold Today</h3>
            <p className="stat-value">186</p>
          </div>
          <div className="stat-card">
            <h3>Revenue Today</h3>
            <p className="stat-value">$2,450</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-card">
              <Film size={24} />
              <span>Add Movie</span>
            </button>
            <button className="action-card">
              <Calendar size={24} />
              <span>Schedule Showtime</span>
            </button>
            <button className="action-card">
              <Users size={24} />
              <span>Manage Staff</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
