import type { ReactNode } from 'react';
import BrandLogo from '../BrandLogo';
import { radius, typography } from '../../styles/designSystem';
import { PublicFooter } from './PublicFooter';

type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalDocumentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export const LegalDocumentPage = ({ eyebrow, title, description, updatedAt, sections }: LegalDocumentPageProps) => (
  <main className="legal-document-page">
    <style>{`
      .legal-document-page {
        min-height: 100vh;
        background: #f7f7f5;
        color: #1a1721;
        font-family: ${typography.fontFamily};
      }

      .legal-document-header {
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid #e4e0ec;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(12px);
      }

      .legal-document-header-inner {
        width: min(1200px, calc(100% - 36px));
        min-height: 68px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .legal-document-header a {
        color: #4a4459;
        font-size: ${typography.size.sm};
        font-weight: ${typography.weight.semibold};
        text-decoration: none;
      }

      .legal-document-intro {
        width: min(1200px, calc(100% - 36px));
        margin: 0 auto;
        padding: 52px 0 36px;
        border-bottom: 1px solid #d7d2dc;
      }

      .legal-document-eyebrow {
        margin: 0 0 14px;
        color: #7c7589;
        font-size: ${typography.size.xs};
        font-weight: ${typography.weight.bold};
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .legal-document-intro h1 {
        max-width: 780px;
        margin: 0;
        font-size: clamp(2rem, 4vw, 3.5rem);
        line-height: 1.08;
        letter-spacing: 0;
      }

      .legal-document-description {
        max-width: 780px;
        margin: 18px 0 0;
        color: #4a4459;
        line-height: 1.65;
      }

      .legal-document-layout {
        width: min(1200px, calc(100% - 36px));
        margin: 0 auto;
        display: grid;
        grid-template-columns: 240px minmax(0, 760px);
        justify-content: space-between;
        gap: 64px;
        padding: 42px 0 24px;
      }

      .legal-document-nav {
        position: sticky;
        top: 94px;
        align-self: start;
        display: grid;
        gap: 2px;
        padding-left: 16px;
        border-left: 1px solid #cfc8dc;
      }

      .legal-document-nav strong {
        margin-bottom: 8px;
        font-size: ${typography.size.sm};
      }

      .legal-document-nav a {
        min-height: 34px;
        display: flex;
        align-items: center;
        color: #625b6d;
        font-size: ${typography.size.sm};
        text-decoration: none;
      }

      .legal-document-article {
        min-width: 0;
      }

      .legal-document-updated {
        padding: 16px 18px;
        border: 1px solid #ded9e5;
        border-radius: ${radius.md};
        background: #fff;
        color: #4a4459;
        font-size: ${typography.size.sm};
      }

      .legal-document-section {
        scroll-margin-top: 92px;
        padding: 30px 0;
        border-bottom: 1px solid #ded9e5;
      }

      .legal-document-section h2 {
        margin: 0 0 14px;
        font-size: clamp(1.3rem, 2vw, 1.7rem);
        line-height: 1.25;
      }

      .legal-document-section p,
      .legal-document-section li {
        color: #4a4459;
        line-height: 1.7;
      }

      .legal-document-section p {
        margin: 0 0 12px;
      }

      .legal-document-section p:last-child {
        margin-bottom: 0;
      }

      .legal-document-section ul {
        margin: 12px 0 0;
        padding-left: 20px;
      }

      .legal-document-section li + li {
        margin-top: 8px;
      }

      @media (max-width: 820px) {
        .legal-document-layout {
          grid-template-columns: minmax(0, 1fr);
          gap: 24px;
        }

        .legal-document-nav {
          position: static;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          padding: 14px 0;
          border-top: 1px solid #d7d2dc;
          border-bottom: 1px solid #d7d2dc;
          border-left: 0;
        }

        .legal-document-nav strong {
          grid-column: 1 / -1;
        }
      }

      @media (max-width: 520px) {
        .legal-document-header-inner,
        .legal-document-intro,
        .legal-document-layout {
          width: min(100% - 32px, 1200px);
        }

        .legal-document-intro {
          padding-top: 36px;
        }

        .legal-document-nav {
          grid-template-columns: 1fr;
        }
      }
    `}</style>

    <header className="legal-document-header">
      <div className="legal-document-header-inner">
        <a href="/" aria-label="Ir para a página inicial do VetEnsino"><BrandLogo size="sm" compact /></a>
        <a href="/">Voltar ao início</a>
      </div>
    </header>

    <div className="legal-document-intro">
      <p className="legal-document-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="legal-document-description">{description}</p>
    </div>

    <div className="legal-document-layout">
      <nav className="legal-document-nav" aria-label={`Seções de ${title}`}>
        <strong>Neste documento</strong>
        {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </nav>

      <article className="legal-document-article">
        <div className="legal-document-updated">Última atualização: {updatedAt}.</div>
        {sections.map((section, index) => (
          <section className="legal-document-section" id={section.id} key={section.id}>
            <h2>{index + 1}. {section.title}</h2>
            {section.content}
          </section>
        ))}
      </article>
    </div>

    <PublicFooter />
  </main>
);

export default LegalDocumentPage;