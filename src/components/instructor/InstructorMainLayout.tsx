import type { ReactNode } from 'react';
import { AdminBreadcrumb } from '../admin/AdminBreadcrumb';
import { InstructorTopBar } from './InstructorTopBar';
import { density, spacing, typography } from '../../styles/designSystem';

type InstructorMainLayoutProps = {
  children: ReactNode;
  breadcrumb: Array<{ label: string; to?: string }>;
};

export const InstructorMainLayout = ({ children, breadcrumb }: InstructorMainLayoutProps) => (
  <main style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily }}>
    <InstructorTopBar />
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: `${spacing.md} ${spacing.xl} ${spacing.xxl}`, display: 'grid', gap: density.pageGap }}>
      <AdminBreadcrumb items={breadcrumb} rootLabel="Painel do Docente" rootTo="/instructor/cursos" />
      {children}
    </div>
  </main>
);

export default InstructorMainLayout;
