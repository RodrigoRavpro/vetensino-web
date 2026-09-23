import bannerHero from '../../assets/banner.png';
import bannerMobile from '../../assets/banner-sm.png';
import { useEffect, useState } from 'react';
import BrandLogo from '../../components/BrandLogo';
import { api } from '../../services/api';
import { spacing, radius, typography } from '../../styles/designSystem';

const navItems = ['Cursos', 'Como funciona', 'Resultados', 'Preços'];

const mockFeaturedCourses = [
  {
    id: 'medicina-veterinaria',
    title: 'Medicina Veterinária',
    subtitle: 'Fundamentos e atendimento clínico',
    category: 'Saúde e diagnóstico',
    level: 'Iniciante',
    rating: '4.9',
    students: '2.4k',
    duration: '12 módulos',
    price: 'R$ 499',
    tag: 'Mais vendido',
  },
  {
    id: 'cirurgia',
    title: 'Cirurgia e Procedimentos',
    subtitle: 'Práticas seguras e protocolos clínicos',
    category: 'Procedimentos',
    level: 'Intermediário',
    rating: '4.8',
    students: '1.8k',
    duration: '10 módulos',
    price: 'R$ 399',
    tag: 'Popular',
  },
  {
    id: 'gestao-clinica',
    title: 'Gestão Clínica',
    subtitle: 'Fluxos, faturamento e performance da clínica',
    category: 'Negócios',
    level: 'Todos os níveis',
    rating: '4.9',
    students: '3.1k',
    duration: '9 módulos',
    price: 'R$ 349',
    tag: 'Novo',
  },
];

type FeaturedCourse = (typeof mockFeaturedCourses)[number];

const footerLinks = [
  { label: 'Cursos', href: '#' },
  { label: 'Sobre', href: '#' },
  { label: 'Contato', href: '#' },
  { label: 'Política de Privacidade', href: '#' },
  { label: 'Termos de Uso', href: '#' },
];

const PublicHeader = () => (
  <>
    <style>{`
      @media (max-width: 900px) {
        .purple-cursos-header {
          padding: 10px 14px !important;
        }

        .purple-cursos-header-inner {
          gap: 12px !important;
          padding: 0 !important;
        }

        .purple-cursos-header-brand {
          gap: 8px !important;
        }

        .purple-cursos-header-logo {
          width: 28px !important;
          height: 28px !important;
          font-size: 0.9rem !important;
        }

        .purple-cursos-header-brand-text {
          display: none !important;
        }

        .purple-cursos-header-nav {
          display: none !important;
        }

        .purple-cursos-header-login {
          display: none !important;
        }

        .purple-cursos-header-menu {
          display: inline-flex !important;
        }
      }
    `}</style>

    <header
      className="purple-cursos-header"
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
        className="purple-cursos-header-inner"
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
        <div className="purple-cursos-header-brand" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <BrandLogo size="sm" compact />
        </div>

        <nav
          className="purple-cursos-header-nav"
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
              key={item}
              href="#"
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <a
            className="purple-cursos-header-login"
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
            className="purple-cursos-header-menu"
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
      .purple-cursos-hero {
        aspect-ratio: 16 / 7.8;
      }

      @media (max-width: 900px) {
        .purple-cursos-hero {
          aspect-ratio: 1 / 1.08 !important;
          min-height: 0 !important;
          background-image: url('${bannerMobile}') !important;
          background-size: cover !important;
          background-position: center center !important;
        }

        .purple-cursos-hero-inner {
          grid-template-columns: 1fr !important;
          padding: 22px 18px 26px !important;
          min-height: 0 !important;
        }

        .purple-cursos-hero-copy {
          max-width: 100% !important;
          gap: 14px !important;
        }

        .purple-cursos-hero-title {
          max-width: 100% !important;
          font-size: clamp(2.5rem, 9vw, 3.8rem) !important;
        }

        .purple-cursos-hero-text {
          max-width: 100% !important;
          font-size: 1rem !important;
        }

        .purple-cursos-hero-actions {
          width: 100% !important;
        }

        .purple-cursos-hero-actions a {
          flex: 1 1 100% !important;
          width: 100% !important;
        }
      }
    `}</style>

    <section
      className="purple-cursos-hero"
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
      className="purple-cursos-hero-inner"
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
        <div className="purple-cursos-hero-copy" style={{ display: 'grid', gap: spacing.sm, maxWidth: '620px' }}>
          <h1
            className="purple-cursos-hero-title"
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
            Aprenda com quem entende a rotina do veterinário
          </h1>

          <p
            className="purple-cursos-hero-text"
            style={{
              margin: 0,
              color: 'rgba(32, 22, 47, 0.82)',
              fontSize: 'clamp(1rem, 1.4vw, 1.35rem)',
              lineHeight: 1.38,
              maxWidth: '560px',
            }}
          >
            Especialização prática em medicina veterinária, diagnóstico e gestão para evoluir com confiança.
          </p>
        </div>

        <div className="purple-cursos-hero-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, maxWidth: '620px' }}>
          <a
            href="/cursos/medicina-veterinaria"
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
            Ver cursos
          </a>
          <a
            href="/login"
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
            Falar com consultor
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

const PublicFeaturedCourses = ({ courses }: { courses: FeaturedCourse[] }) => {
  if (courses.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '52px 18px 28px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          gap: spacing.md,
          marginBottom: spacing.lg,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: radius.pill,
              background: 'var(--brand-subtle)',
              color: 'var(--brand-primary)',
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              marginBottom: spacing.sm,
            }}
          >
            Cursos em destaque
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              fontWeight: typography.weight.bold,
            }}
          >
            Descubra trilhas pensadas para crescer na prática
          </h2>
        </div>
        <a
          href="/cursos/medicina-veterinaria"
          style={{
            textDecoration: 'none',
            color: 'var(--brand-primary)',
            fontWeight: typography.weight.bold,
          }}
        >
          Ver todos os cursos
        </a>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
        }}
      >
        {courses.map((course) => (
          <article
            key={course.id}
            style={{
              display: 'grid',
              gap: spacing.sm,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: radius.xl,
              padding: '18px',
              overflow: 'hidden',
              boxShadow: '0 16px 32px rgba(18, 12, 28, 0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.sm,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: radius.pill,
                  background: 'var(--brand-subtle)',
                  color: 'var(--brand-primary)',
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                }}
              >
                {course.tag}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: typography.size.sm }}>
                {course.level}
              </span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, rgba(136,84,192,0.12), rgba(169,127,217,0.18))',
                borderRadius: radius.lg,
                minHeight: '120px',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--brand-primary)',
                fontWeight: typography.weight.bold,
                fontSize: typography.size.lg,
                border: '1px solid rgba(136,84,192,0.12)',
              }}
            >
              {course.category}
            </div>

            <div style={{ display: 'grid', gap: spacing.xs }}>
              <div style={{ fontSize: typography.size.xs, color: 'var(--text-muted)' }}>{course.category}</div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  lineHeight: 1.25,
                  fontWeight: typography.weight.bold,
                }}
              >
                {course.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  fontSize: '0.96rem',
                }}
              >
                {course.subtitle}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                paddingTop: spacing.sm,
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span>⭐ {course.rating}</span>
              <span>{course.students} alunos</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.sm,
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{course.duration}</span>
              <strong style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>{course.price}</strong>
            </div>

            <a
              href={`/cursos/${course.id}`}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: radius.pill,
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-light))',
                color: 'var(--text-on-brand)',
                fontWeight: typography.weight.bold,
                marginTop: '2px',
              }}
            >
              Saiba mais
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

const PublicFooter = () => (
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
      <span>Plataforma criada com foco em educação veterinária.</span>
    </div>
  </footer>
);

export const LandingPage = () => {
  const [featuredCourses, setFeaturedCourses] = useState<FeaturedCourse[]>(mockFeaturedCourses);

  useEffect(() => {
    let active = true;
    void api.get<{ courses: Array<{ id: string; slug: string; title: string; subtitle: string | null; price: string; promoPrice: string | null; workloadHours: number | null; classes: Array<{ capacity: number }> }> }>('/courses')
      .then(({ data }) => {
        if (!active || data.courses.length === 0) return;
        setFeaturedCourses(data.courses.map((course) => ({
          id: course.slug,
          title: course.title,
          subtitle: course.subtitle ?? 'Conteúdo especializado para profissionais veterinários.',
          category: 'Cursos veterinários',
          level: 'Todos os níveis',
          rating: 'Novo',
          students: `${course.classes.length} turma(s)`,
          duration: course.workloadHours ? `${course.workloadHours} horas` : 'Acesso online',
          price: `R$ ${course.promoPrice ?? course.price}`,
          tag: course.promoPrice ? 'Oferta' : 'Novo',
        })));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

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
      <PublicFeaturedCourses courses={featuredCourses} />
      <PublicFooter />
    </main>
  );
};

export default LandingPage;
