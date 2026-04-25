interface PageHeaderProps {
  title: string;
  subtitle: string;
  userEmail?: string;
}

export function PageHeader({ title, subtitle, userEmail }: PageHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>{title}</h1>
        <p className="user-role">{subtitle}</p>
      </div>
      <div className="user-info">
        <span>{userEmail}</span>
      </div>
    </header>
  );
}
