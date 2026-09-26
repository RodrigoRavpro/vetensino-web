import BrandLogo from '../BrandLogo';
import { spacing, typography } from '../../styles/designSystem';
import { FooterGeometricPattern } from './FooterGeometricPattern';

const footerLinks = [
  { label: 'Treinamentos', href: '/cursos/medicina-veterinaria' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Criar um treinamento', href: '/instructor/cursos' },
  { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { label: 'Termos de Uso', href: '/termos-de-uso' },
];

export const PublicFooter = () => (
  <footer
    style={{
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid #e4e0ec',
      background: '#ffffff',
      color: '#1a1721',
      marginTop: spacing.xxl,
    }}
  >
    <FooterGeometricPattern />
    <div
      className="public-footer-main"
      style={{
        position: 'relative',
        zIndex: 1,
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
              color: '#4a4459',
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
              color: '#4a4459',
              textDecoration: 'none',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>

    <div
      className="public-footer-bottom"
      style={{
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid #e4e0ec',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${spacing.md} ${spacing.xl}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.md,
        flexWrap: 'wrap',
        color: '#7c7589',
        fontSize: typography.size.sm,
      }}
    >
      <span>© 2026 VetEnsino</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs }}>
        Idealizado por
        <a
          className="purplevet-credit"
          href="https://purplevet.com.br/"
          target="_blank"
          rel="noreferrer"
          aria-label="Acessar o site da PurpleVet"
        >
          <img
            src="https://purplevet.com.br/assets/logos/logo.png"
            alt=""
            style={{ width: '32px', height: '32px', objectFit: 'cover', objectPosition: 'left' }}
          />
          <strong>PurpleVet</strong>
        </a>
      </span>
    </div>
  </footer>
);

export default PublicFooter;
