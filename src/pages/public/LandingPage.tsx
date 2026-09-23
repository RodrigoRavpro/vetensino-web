import bannerHero from '../../assets/banner.png';
import bannerMobile from '../../assets/banner-sm.png';
import BrandLogo from '../../components/BrandLogo';
import { PublicFooter } from '../../components/public/PublicFooter';
import { spacing, radius, typography } from '../../styles/designSystem';

const navItems = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Para quem é', href: '#para-quem-e' },
  { label: 'Treinamentos', href: '#treinamentos' },
];

const PublicHeader = () => (
  <>
    <style>{`
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

        .vetensino-header-nav {
          display: none !important;
        }

        .vetensino-header-login {
          display: none !important;
        }

        .vetensino-header-menu {
          display: inline-flex !important;
        }
      }
    `}</style>

    <header
      className="vetensino-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(12px)',
        background: 'color-mix(in srgb, var(--bg-base) 82%, transparent)',
        borderBottom: '1px solid var(--border-subtle)',
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
          <BrandLogo size="sm" compact />
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
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-light))',
              color: 'var(--text-on-brand)',
              borderRadius: radius.pill,
              padding: `${spacing.sm} ${spacing.lg}`,
              fontWeight: typography.weight.medium,
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
            aria-label="Abrir menu"
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
    </header>
  </>
);

const PublicHero = () => (
  <>
    <style>{`
      .vetensino-hero {
        aspect-ratio: 16 / 7.8;
      }

      @media (max-width: 900px) {
        .vetensino-hero {
          aspect-ratio: 1 / 1.08 !important;
          min-height: 0 !important;
          background-image: url('${bannerMobile}') !important;
          background-size: cover !important;
          background-position: center center !important;
        }

        .vetensino-hero-inner {
          grid-template-columns: 1fr !important;
          padding: 22px 18px 26px !important;
          min-height: 0 !important;
        }

        .vetensino-hero-copy {
          max-width: 100% !important;
          gap: 14px !important;
        }

        .vetensino-hero-title {
          max-width: 100% !important;
          font-size: clamp(2.5rem, 9vw, 3.8rem) !important;
        }

        .vetensino-hero-text {
          max-width: 100% !important;
          font-size: 1rem !important;
        }

        .vetensino-hero-actions {
          width: 100% !important;
        }

        .vetensino-hero-actions a {
          flex: 1 1 100% !important;
          width: 100% !important;
        }
      }
    `}</style>

    <section
      className="vetensino-hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginTop: 0,
        minHeight: 0,
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        backgroundImage: `url(${bannerHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: 'auto',
      }}
    >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.22,
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.09) 18%, transparent 18%), radial-gradient(circle at 50% 60%, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.08) 12%, transparent 12%)',
      }}
    />

    <div
      className="vetensino-hero-inner"
      style={{
        position: 'relative',
        maxWidth: '1280px',
        margin: '0 auto',
        minHeight: '100%',
        display: 'grid',
        gridTemplateColumns: '1.3fr 0.7fr',
        alignItems: 'center',
        gap: '20px',
        padding: '0 20px',
        height: '100%',
      }}
    >
      <div style={{ display: 'grid', gap: spacing.lg, position: 'relative', zIndex: 2, padding: '20px 0 18px' }}>
        <div className="vetensino-hero-copy" style={{ display: 'grid', gap: spacing.sm, maxWidth: '620px' }}>
          <h1
            className="vetensino-hero-title"
            style={{
              margin: 0,
              fontSize: 'clamp(2.6rem, 4.4vw, 5.6rem)',
              lineHeight: 0.94,
              letterSpacing: '-0.07em',
              fontWeight: typography.weight.bold,
              color: '#20162f',
              maxWidth: '620px',
            }}
          >
            Treinamentos veterinários que viram prática
          </h1>

          <p
            className="vetensino-hero-text"
            style={{
              margin: 0,
              color: 'rgba(32, 22, 47, 0.82)',
              fontSize: 'clamp(1rem, 1.4vw, 1.35rem)',
              lineHeight: 1.38,
              maxWidth: '560px',
            }}
          >
            Uma plataforma para veterinários criarem, organizarem e acompanharem capacitações para profissionais e equipes clínicas.
          </p>
        </div>

        <div className="vetensino-hero-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, maxWidth: '620px' }}>
          <a
            href="#treinamentos"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'linear-gradient(135deg, #5d3eaa, #7d5ad0)',
              color: '#fff',
              borderRadius: '999px',
              padding: '15px 22px',
              fontWeight: typography.weight.bold,
              fontSize: '1rem',
              minWidth: '200px',
              boxShadow: '0 16px 28px rgba(93, 62, 170, 0.2)',
            }}
          >
            Explorar treinamentos
          </a>
          <a
            href="/instructor/cursos"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(32, 22, 47, 0.2)',
              background: 'rgba(255,255,255,0.08)',
              color: '#20162f',
              borderRadius: '999px',
              padding: '15px 22px',
              fontWeight: typography.weight.bold,
              fontSize: '1rem',
              minWidth: '220px',
            }}
          >
            Criar um treinamento
          </a>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '480px',
          zIndex: 2,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '620px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </div>
    </div>
    </section>
  </>
);

const HomeSection = ({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) => (
  <section id={id} style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 18px 0' }}>
    <div style={{ maxWidth: '720px', display: 'grid', gap: spacing.sm, marginBottom: spacing.xl }}>
      <span style={{ color: 'var(--brand-primary)', fontSize: typography.size.xs, fontWeight: typography.weight.bold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{eyebrow}</span>
      <h2 style={{ margin: 0, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.08, fontWeight: typography.weight.bold }}>{title}</h2>
    </div>
    {children}
  </section>
);

const benefitItems = [
  { title: 'Conteúdo de quem pratica', text: 'Treinamentos criados por veterinários que conhecem os desafios da rotina clínica.' },
  { title: 'Turmas organizadas', text: 'Estruture cursos, turmas e formatos online, presenciais ou híbridos em um só lugar.' },
  { title: 'Evolução acompanhada', text: 'Acompanhe matrículas, progresso e conclusão para transformar conteúdo em prática.' },
];

const audienceItems = [
  { title: 'Veterinários e equipes', text: 'Encontre capacitações aplicáveis ao momento profissional e à rotina da sua equipe.' },
  { title: 'Instrutores', text: 'Publique seu conhecimento, organize turmas e acompanhe seus alunos.' },
  { title: 'Clínicas e hospitais', text: 'Estruture treinamentos internos e mantenha o desenvolvimento da equipe visível.' },
];

export const LandingPage = () => (
  <>
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
      }}
    >
      <PublicHeader />
      <PublicHero />
      <HomeSection id="como-funciona" eyebrow="Uma plataforma, diferentes jornadas" title="Da experiência do veterinário ao treinamento que a equipe consegue acompanhar.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md }}>
          {benefitItems.map((item, index) => (
            <article key={item.title} style={{ display: 'grid', gap: spacing.sm, padding: spacing.lg, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.lg }}>
              <span style={{ color: 'var(--brand-primary)', fontSize: typography.size.sm, fontWeight: typography.weight.bold }}>0{index + 1}</span>
              <h3 style={{ margin: 0, fontSize: typography.size.md }}>{item.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.text}</p>
            </article>
          ))}
        </div>
      </HomeSection>

      <HomeSection id="para-quem-e" eyebrow="Feito para a rotina veterinária" title="Cada pessoa entra com uma necessidade. Todos avançam com mais clareza.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: spacing.md }}>
          {audienceItems.map((item) => (
            <article key={item.title} style={{ display: 'grid', gap: spacing.sm, padding: spacing.lg, borderLeft: '3px solid var(--brand-primary)', background: 'rgba(136, 84, 192, 0.06)' }}>
              <h3 style={{ margin: 0, fontSize: typography.size.md }}>{item.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.text}</p>
            </article>
          ))}
        </div>
      </HomeSection>

      <HomeSection id="treinamentos" eyebrow="Catálogo em construção contínua" title="Treinamentos para desenvolver pessoas e melhorar a prática.">
        <div style={{ display: 'grid', gap: spacing.md, padding: spacing.xl, borderRadius: radius.lg, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: spacing.md, flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: spacing.xs }}>
              <h3 style={{ margin: 0, fontSize: typography.size.lg }}>Explore o primeiro treinamento disponível</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Acesse o conteúdo publicado, conheça a turma e escolha o próximo passo da sua formação.</p>
            </div>
            <a href="/cursos/medicina-veterinaria" style={{ textDecoration: 'none', color: 'var(--brand-primary)', fontWeight: typography.weight.bold }}>Ver treinamento</a>
          </div>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: typography.size.sm }}>
            <span>Medicina veterinária</span><span>Diagnóstico</span><span>Gestão de clínicas</span>
          </div>
        </div>
      </HomeSection>

      <PublicFooter />
    </main>
  </>
);

export default LandingPage;
