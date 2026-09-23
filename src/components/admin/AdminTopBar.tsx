import { NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from '../BrandLogo';
import { useAuth } from '../../contexts/AuthContext';
import { palette, radius, spacing, typography } from '../../styles/designSystem';

const navItems = [
  { label: 'Cursos', to: '/admin/cursos' },
  { label: 'Usuários', to: '/admin/usuarios' },
  { label: 'Design system', to: '/admin/design-system' },
];

export const AdminTopBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <style>{`
        @media (max-width: 720px) {
          .purple-admin-topbar-inner {
            align-items: flex-start !important;
            flex-direction: column !important;
            padding: 12px 20px !important;
          }
          .purple-admin-topbar-nav {
            width: 100% !important;
            overflow-x: auto !important;
          }
          .purple-admin-topbar-actions {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: `1px solid ${palette.brand.subtle}`, background: 'color-mix(in srgb, var(--bg-surface) 94%, transparent)', backdropFilter: 'blur(14px)', fontFamily: typography.fontFamily }}>
        <div className="purple-admin-topbar-inner" style={{ maxWidth: 1180, minHeight: 68, margin: '0 auto', padding: `0 ${spacing.xl}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xl }}>
          <NavLink to="/admin/cursos" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: 'var(--text-primary)', textDecoration: 'none', flexShrink: 0, fontSize: typography.size.md }}>
            <BrandLogo size="sm" compact />
            <span style={{ color: 'var(--text-muted)', fontWeight: typography.weight.medium }}>Admin</span>
          </NavLink>

          <nav className="purple-admin-topbar-nav" aria-label="Navegação administrativa" style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flex: 1 }}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} style={({ isActive }) => ({ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontSize: typography.size.sm, fontWeight: isActive ? typography.weight.bold : typography.weight.medium, padding: `${spacing.sm} ${spacing.md}`, borderRadius: radius.pill, background: isActive ? palette.brand.subtle : 'transparent', whiteSpace: 'nowrap' })}>
                {item.label}
              </NavLink>
            ))}
            <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: typography.size.sm, padding: `${spacing.sm} ${spacing.md}`, whiteSpace: 'nowrap' }}>Site público</a>
          </nav>

          <div className="purple-admin-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexShrink: 0 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: typography.size.sm, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</span>
            <button type="button" onClick={() => void handleLogout()} style={{ border: `1px solid ${palette.brand.subtle}`, background: 'transparent', color: 'var(--text-secondary)', borderRadius: radius.pill, padding: `${spacing.sm} ${spacing.md}`, cursor: 'pointer', fontSize: typography.size.sm, fontFamily: 'inherit', fontWeight: typography.weight.medium }}>Sair</button>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminTopBar;
