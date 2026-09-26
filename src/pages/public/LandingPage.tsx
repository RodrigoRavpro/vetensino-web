import { useEffect, useState } from 'react';
import BrandLogo from '../../components/BrandLogo';
import { PublicFooter } from '../../components/public/PublicFooter';
import { VEHero } from '../../components/public/VEHeroEditorial';
import { spacing, radius, typography } from '../../styles/designSystem';

const navItems = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Para quem é', href: '#para-quem-e' },
  { label: 'Treinamentos', href: '#treinamentos' },
];

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <>
    <style>{`
      .vetensino-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        width: 0;
        height: 2px;
        border-radius: 999px;
        background: #f4b21a;
        transform: translateX(-50%);
        transition: width 180ms ease;
      }

      .vetensino-header.is-scrolled::after {
        width: min(180px, 34vw);
      }

      .vetensino-header:not(.is-scrolled) .vetensino-header-nav {
        color: rgba(255, 255, 255, 0.84) !important;
      }

      .vetensino-header:not(.is-scrolled) .vetensino-header-menu > span,
      .vetensino-header:not(.is-scrolled) .vetensino-header-menu > span > span {
        background: #fff !important;
      }

      .vetensino-mobile-nav {
        display: none;
      }

      @media (max-width: 900px) {
        .vetensino-header {
          padding: 10px 14px !important;
        }

        .vetensino-header-inner {
          gap: 12px !important;
          padding: 0 !important;
        }

        .vetensino-header-brand {
          gap: 8px !important;
        }

        .vetensino-header-logo {
          width: 28px !important;
          height: 28px !important;
          font-size: 0.9rem !important;
        }

        .vetensino-header-brand-text {
          display: none !important;
        }

        .vetensino-header-wordmark .brand-logo-full {
          display: inline-block !important;
        }

        .vetensino-header-wordmark .brand-logo-initial {
          display: none !important;
        }

        .vetensino-header-nav {
          display: none !important;
        }

        .vetensino-header-login {
          display: none !important;
        }

        .vetensino-header-menu {
          display: inline-flex !important;
        }

        .vetensino-mobile-nav {
          display: grid;
          gap: 2px;
          padding: 4px 14px 14px;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }

        .vetensino-mobile-nav a {
          min-height: 44px;
          display: flex;
          align-items: center;
          padding: 0 8px;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
        }
      }
    `}</style>

    <header
      className={`vetensino-header${isScrolled ? ' is-scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 10,
        backdropFilter: isScrolled || isMenuOpen ? 'blur(12px)' : 'none',
        background: isScrolled || isMenuOpen ? 'rgba(255, 255, 255, 0.96)' : 'transparent',
        borderBottom: '1px solid transparent',
        boxShadow: isScrolled ? '0 8px 24px rgba(32, 28, 37, 0.08)' : 'none',
        transition: 'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
      }}
    >
      <div
        className="vetensino-header-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
          padding: '12px 18px',
        }}
      >
        <div className="vetensino-header-brand" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <BrandLogo className="vetensino-header-wordmark" size="sm" compact />
        </div>

        <nav
          className="vetensino-header-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            color: 'var(--text-secondary)',
            fontSize: typography.size.sm,
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <a
            className="vetensino-header-login"
            href="/login"
            style={{
              textDecoration: 'none',
              border: 'none',
              background: '#5d3e8f',
              color: 'var(--text-on-brand)',
              borderRadius: radius.md,
              padding: `${spacing.sm} ${spacing.lg}`,
              fontWeight: typography.weight.semibold,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Entrar
          </a>

          <button
            className="vetensino-header-menu"
            type="button"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="vetensino-mobile-nav"
            onClick={() => setIsMenuOpen((current) => !current)}
            style={{
              display: 'none',
              width: 40,
              height: 40,
              border: '1px solid rgba(32, 22, 47, 0.12)',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '50%',
              padding: 0,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 18,
                height: 2,
                background: '#20162f',
                borderRadius: 999,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: -6,
                  display: 'block',
                  width: 18,
                  height: 2,
                  background: '#20162f',
                  borderRadius: 999,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  display: 'block',
                  width: 18,
                  height: 2,
                  background: '#20162f',
                  borderRadius: 999,
                }}
              />
            </span>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav id="vetensino-mobile-nav" className="vetensino-mobile-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="/login">Entrar</a>
        </nav>
      )}
    </header>
  </>
  );
};

const HomeSection = ({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) => (
  <section className="landing-section" id={id} style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 18px 0' }}>
    <div className="landing-section-header" style={{ maxWidth: '860px', display: 'grid', gap: '6px', marginBottom: spacing.lg }}>
      <span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs, fontWeight: typography.weight.bold, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{eyebrow}</span>
      <h2 style={{ margin: 0, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.15, letterSpacing: 0, fontWeight: typography.weight.bold }}>{title}</h2>
    </div>
    {children}
  </section>
);

const benefitItems = [
  { title: 'Conteúdo aplicado', text: 'Treinamentos criados por profissionais que conhecem os desafios da rotina clínica.' },
  { title: 'Gestão de turmas', text: 'Organize cursos, participantes e formatos online, presenciais ou híbridos em um só lugar.' },
  { title: 'Acompanhamento', text: 'Consulte matrículas, progresso e conclusão para orientar o desenvolvimento da equipe.' },
];

const audienceItems = [
  { title: 'Veterinários e equipes', text: 'Encontre capacitações aplicáveis ao momento profissional e à rotina da sua equipe.' },
  { title: 'Instrutores', text: 'Publique seu conhecimento, organize turmas e acompanhe seus alunos.' },
  { title: 'Clínicas e hospitais', text: 'Estruture treinamentos internos e mantenha o desenvolvimento da equipe visível.' },
];

export const LandingPage = () => (
  <main
      style={{
        minHeight: '100vh',
        background: '#f7f7f5',
        color: 'var(--text-primary)',
        fontFamily: typography.fontFamily,
      }}
    >
      <PublicHeader />
      <VEHero />
      <HomeSection id="como-funciona" eyebrow="Operação de treinamento" title="Crie, organize e acompanhe treinamentos em um único fluxo.">
        <div className="landing-structured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', borderTop: '1px solid var(--border-strong)', borderBottom: '1px solid var(--border-subtle)' }}>
          {benefitItems.map((item, index) => (
            <article key={item.title} style={{ display: 'grid', alignContent: 'start', gap: spacing.sm, padding: `${spacing.lg} ${spacing.lg}`, borderRight: index < benefitItems.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs, fontWeight: typography.weight.bold }}>0{index + 1}</span>
              <h3 style={{ margin: 0, fontSize: typography.size.md }}>{item.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.text}</p>
            </article>
          ))}
        </div>
      </HomeSection>

      <HomeSection id="para-quem-e" eyebrow="Aplicação por perfil" title="Uma plataforma para quem ensina, aprende e coordena equipes.">
        <div className="landing-structured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', borderTop: '1px solid var(--border-strong)', borderBottom: '1px solid var(--border-subtle)' }}>
          {audienceItems.map((item, index) => (
            <article key={item.title} style={{ display: 'grid', alignContent: 'start', gap: spacing.sm, padding: spacing.lg, borderLeft: index > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
              <h3 style={{ margin: 0, fontSize: typography.size.md }}>{item.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.text}</p>
            </article>
          ))}
        </div>
      </HomeSection>

      <HomeSection id="treinamentos" eyebrow="Catálogo" title="Treinamentos disponíveis para a rotina veterinária.">
        <div style={{ display: 'grid', gap: spacing.md, padding: `${spacing.lg} 0`, borderTop: '1px solid var(--border-strong)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: spacing.md, flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: spacing.xs }}>
              <h3 style={{ margin: 0, fontSize: typography.size.lg }}>Explore o primeiro treinamento disponível</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Acesse o conteúdo publicado, conheça a turma e escolha o próximo passo da sua formação.</p>
            </div>
            <a className="landing-training-link" href="/cursos/medicina-veterinaria" style={{ textDecoration: 'none', color: 'var(--brand-primary)', fontWeight: typography.weight.bold }}>Ver treinamento</a>
          </div>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: typography.size.sm }}>
            <span>Medicina veterinária</span><span>Diagnóstico</span><span>Gestão de clínicas</span>
          </div>
        </div>
      </HomeSection>

      <PublicFooter />
    </main>
);

export default LandingPage;
