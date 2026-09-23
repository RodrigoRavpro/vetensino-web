import type { ReactNode } from 'react';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { AdminTopBar } from './AdminTopBar';
import { density, spacing, typography } from '../../styles/designSystem';

type AdminMainLayoutProps = {
  children: ReactNode;
  breadcrumb: Array<{ label: string; to?: string }>;
};

export const AdminMainLayout = ({ children, breadcrumb }: AdminMainLayoutProps) => (
  <main style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily }}>
    <AdminTopBar />
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: `${spacing.md} ${spacing.xl} ${spacing.xxl}`, display: 'grid', gap: density.pageGap }}>
      <AdminBreadcrumb items={breadcrumb} />
      {children}
    </div>
  </main>
);

export default AdminMainLayout;
