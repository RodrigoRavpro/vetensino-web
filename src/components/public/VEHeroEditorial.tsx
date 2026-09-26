import bannerHero from '../../assets/banner.png';
import bannerMobile from '../../assets/banner-sm.png';
import { radius, typography } from '../../styles/designSystem';

export const VEHero = () => (
  <section className="ve-hero" aria-labelledby="ve-hero-title">
    <style>{`
      .ve-hero {
        position: relative;
        min-height: min(760px, 88svh);
        display: grid;
        place-items: center;
        overflow: hidden;
        isolation: isolate;
        background: #929395;
        color: #fff;
      }

      .ve-hero-media {
        position: absolute;
        z-index: -3;
        inset: 0;
        background-image: url('${bannerHero}');
        background-position: center top;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .ve-hero-overlay {
        position: absolute;
        z-index: -2;
        inset: 0;
        background: rgba(29, 25, 33, 0.86);
      }

      .ve-hero-overlay::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(20, 17, 23, 0.38), transparent 44%, rgba(20, 17, 23, 0.32));
      }

      .ve-hero-line {
        position: absolute;
        z-index: -1;
        right: -8%;
        bottom: -46%;
        width: 54vw;
        min-width: 620px;
        aspect-ratio: 1;
        border: 2px solid rgba(244, 178, 26, 0.78);
        border-radius: 50%;
      }

      .ve-hero-line::before {
        content: '';
        position: absolute;
        inset: 28px;
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 50%;
      }

      .ve-hero-content {
        width: min(940px, calc(100% - 40px));
        display: grid;
        justify-items: center;
        gap: 24px;
        padding: 148px 0 96px;
        text-align: center;
      }

      .ve-hero-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: #f4c348;
        font-size: ${typography.size.xs};
        font-weight: ${typography.weight.bold};
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .ve-hero-eyebrow::before,
      .ve-hero-eyebrow::after {
        content: '';
        width: 36px;
        height: 1px;
        background: currentColor;
      }

      .ve-hero-title {
        max-width: 920px;
        margin: 0;
        font-size: clamp(3.4rem, 7.2vw, 7rem);
        font-weight: ${typography.weight.bold};
        line-height: 0.93;
        letter-spacing: 0;
        text-wrap: balance;
      }

      .ve-hero-title em {
        color: #f4c348;
        font-family: inherit;
        font-weight: ${typography.weight.regular};
      }

      .ve-hero-description {
        max-width: 650px;
        margin: 0;
        color: rgba(255, 255, 255, 0.84);
        font-size: clamp(1rem, 1.4vw, 1.18rem);
        line-height: 1.6;
      }

      .ve-hero-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-top: 6px;
      }

      .ve-hero-action {
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 22px;
        border-radius: ${radius.md};
        font-size: ${typography.size.sm};
        font-weight: ${typography.weight.bold};
        text-decoration: none;
      }

      .ve-hero-action:hover {
        text-decoration: none;
      }

      .ve-hero-action-primary {
        border: 1px solid #f4b21a;
        background: #f4b21a;
        color: #211b29;
      }

      .ve-hero-action-secondary {
        border: 1px solid rgba(255, 255, 255, 0.62);
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
      }

      .ve-hero-index {
        position: absolute;
        right: 28px;
        bottom: 24px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: rgba(255, 255, 255, 0.68);
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .ve-hero-index::before {
        content: '';
        width: 52px;
        height: 1px;
        background: #f4b21a;
      }

      @media (max-width: 760px) {
        .ve-hero {
          min-height: min(720px, 100svh);
        }

        .ve-hero-media {
          background-image: url('${bannerMobile}');
          background-position: center center;
        }

        .ve-hero-content {
          width: min(100% - 32px, 620px);
          gap: 18px;
          padding: 122px 0 68px;
        }

        .ve-hero-eyebrow::before,
        .ve-hero-eyebrow::after {
          width: 20px;
        }

        .ve-hero-title {
          font-size: clamp(2.8rem, 14vw, 4.5rem);
          line-height: 0.97;
        }

        .ve-hero-actions {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
        }

        .ve-hero-action {
          width: 100%;
        }

        .ve-hero-line {
          right: -72%;
          bottom: -18%;
          min-width: 540px;
        }

        .ve-hero-index {
          display: none;
        }
      }
    `}</style>

    <div className="ve-hero-media" aria-hidden="true" />
    <div className="ve-hero-overlay" aria-hidden="true" />
    <div className="ve-hero-line" aria-hidden="true" />

    <div className="ve-hero-content">
      <span className="ve-hero-eyebrow">Treinamento veterinário</span>
      <h1 className="ve-hero-title" id="ve-hero-title">
        Conhecimento que <em>transforma</em> a prática.
      </h1>
      <p className="ve-hero-description">
        Capacitações criadas por quem vive a rotina clínica, organizadas para desenvolver profissionais e equipes.
      </p>
      <div className="ve-hero-actions">
        <a className="ve-hero-action ve-hero-action-primary" href="#treinamentos">
          Explorar treinamentos
        </a>
        <a className="ve-hero-action ve-hero-action-secondary" href="/instructor/cursos">
          Criar treinamento
        </a>
      </div>
    </div>

    <span className="ve-hero-index">Formação aplicada</span>
  </section>
);

export default VEHero;