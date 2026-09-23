import BrandLogo from '../BrandLogo';
import { spacing, typography } from '../../styles/designSystem';

const footerLinks = [
  { label: 'Treinamentos', href: '/cursos/medicina-veterinaria' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Criar um treinamento', href: '/instructor/cursos' },
  { label: 'Política de Privacidade', href: '#' },
  { label: 'Termos de Uso', href: '#' },
];

export const PublicFooter = () => (
  <footer
    style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      marginTop: spacing.xxl,
    }}
  >
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${spacing.xl} ${spacing.xl}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: spacing.xl,
      }}
    >
      <div style={{ display: 'grid', gap: spacing.md }}>
        <BrandLogo size="sm" compact />
      </div>

      <div style={{ display: 'grid', gap: spacing.sm }}>
        <strong style={{ fontSize: typography.size.md }}>Acesso rápido</strong>
        {footerLinks.slice(0, 3).map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gap: spacing.sm }}>
        <strong style={{ fontSize: typography.size.md }}>Legal</strong>
        {footerLinks.slice(3).map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>

    <div
      style={{
        borderTop: '1px solid var(--border-subtle)',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${spacing.md} ${spacing.xl}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.md,
        flexWrap: 'wrap',
        color: 'var(--text-muted)',
        fontSize: typography.size.sm,
      }}
    >
      <span>© 2026 VetEnsino</span>
      <span>Gestão de treinamentos feitos por veterinários para veterinários.</span>
    </div>
  </footer>
);

export default PublicFooter;
