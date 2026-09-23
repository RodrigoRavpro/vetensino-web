import { NavLink } from 'react-router-dom';
import { palette, radius, spacing, typography } from '../../styles/designSystem';

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type AdminBreadcrumbProps = {
  items: BreadcrumbItem[];
  rootLabel?: string;
  rootTo?: string;
};

export const AdminBreadcrumb = ({ items, rootLabel = 'Administração', rootTo = '/admin/cursos' }: AdminBreadcrumbProps) => (
  <nav aria-label="Navegação estrutural" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: 'var(--text-muted)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, flexWrap: 'wrap' }}>
    <NavLink to={rootTo} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: `${spacing.xs} ${spacing.sm}`, borderRadius: radius.sm, fontWeight: typography.weight.medium }}>
      {rootLabel}
    </NavLink>
    {items.map((item, index) => (
      <span key={`${item.label}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm }}>
        <span aria-hidden="true" style={{ color: palette.brand.light }}>›</span>
        {item.to ? (
          <NavLink to={item.to} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: `${spacing.xs} ${spacing.sm}`, borderRadius: radius.sm, fontWeight: typography.weight.medium }}>
            {item.label}
          </NavLink>
        ) : (
          <span aria-current="page" style={{ color: 'var(--text-primary)', padding: `${spacing.xs} ${spacing.sm}`, borderRadius: radius.sm, fontWeight: typography.weight.semibold }}>
            {item.label}
          </span>
        )}
      </span>
    ))}
  </nav>
);

export default AdminBreadcrumb;
