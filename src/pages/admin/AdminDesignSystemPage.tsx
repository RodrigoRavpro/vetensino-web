import type { ReactNode } from 'react';
import { AdminMainLayout } from '../../components/admin/AdminMainLayout';
import { density, darkTheme, lightTheme, palette, radius, spacing, typography } from '../../styles/designSystem';

const panelStyle = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  borderRadius: radius.md,
  padding: density.panelPadding,
};

const buttonStyle = {
  border: 0,
  borderRadius: radius.sm,
  padding: density.controlPadding,
  minHeight: density.controlHeight,
  fontFamily: typography.fontFamily,
  fontSize: typography.size.sm,
  fontWeight: typography.weight.semibold,
  cursor: 'pointer',
};

const tokenLabelStyle = {
  color: 'var(--text-muted)',
  fontSize: typography.size.xs,
  fontWeight: typography.weight.semibold,
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
};

const Section = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <section style={{ display: 'grid', gap: density.sectionGap }}>
    <div>
      <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: typography.size.md, fontWeight: typography.weight.semibold }}>{title}</h2>
      <p style={{ margin: `${spacing.xs} 0 0`, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{description}</p>
    </div>
    {children}
  </section>
);

const Swatch = ({ name, value }: { name: string; value: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: spacing.sm, alignItems: 'center' }}>
    <div aria-hidden="true" style={{ width: 40, height: 40, borderRadius: radius.sm, background: value, border: '1px solid var(--border-subtle)' }} />
    <div style={{ minWidth: 0 }}><strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: typography.size.sm }}>{name}</strong><span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs }}>{value}</span></div>
  </div>
);

export const AdminDesignSystemPage = () => (
  <AdminMainLayout breadcrumb={[{ label: 'Design system' }]}>
    <header style={{ display: 'grid', gap: spacing.xs, maxWidth: 720 }}>
      <span style={{ ...tokenLabelStyle, color: palette.brand.light }}>VetEnsino admin</span>
      <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: typography.size.xl, lineHeight: 1.2, fontWeight: typography.weight.semibold }}>Design system</h1>
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: typography.size.sm, lineHeight: 1.5 }}>Referência visual e funcional para construir telas consistentes, densas e fáceis de percorrer.</p>
    </header>

    <div style={{ display: 'grid', gap: density.pageGap }}>
      <Section title="Cores" description="A paleta de marca, estados e superfícies usada pelo produto.">
        <div style={{ ...panelStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: spacing.md }}>
          <Swatch name="Brand primary" value={palette.brand.primary} />
          <Swatch name="Brand dark" value={palette.brand.dark} />
          <Swatch name="Brand light" value={palette.brand.light} />
          <Swatch name="Success" value={palette.state.success} />
          <Swatch name="Warning" value={palette.state.warning} />
          <Swatch name="Danger" value={palette.state.danger} />
          <Swatch name="Info" value={palette.state.info} />
          <Swatch name="Surface" value={lightTheme.bg.surface} />
        </div>
      </Section>

      <Section title="Tipografia" description="A escala usa Plus Jakarta Sans e mantém hierarquia sem excesso de tamanho.">
        <div style={{ ...panelStyle, display: 'grid', gap: spacing.md }}>
          {Object.entries(typography.size).map(([name, value]) => <div key={name} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: spacing.md, alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: spacing.sm }}><span style={{ ...tokenLabelStyle, letterSpacing: 0 }}>{name}</span><span style={{ color: 'var(--text-primary)', fontSize: value, lineHeight: 1.2 }}>VetEnsino</span></div>)}
        </div>
      </Section>

      <Section title="Densidade padrão" description="A escala compacta é o padrão das áreas administrativas e prioriza mais informação por viewport.">
        <div style={{ ...panelStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: spacing.sm }}>
          {Object.entries(density).map(([name, value]) => <div key={name} style={{ padding: spacing.sm, background: 'var(--bg-elevated)', borderRadius: radius.sm }}><span style={{ ...tokenLabelStyle, display: 'block', letterSpacing: 0 }}>{name}</span><strong style={{ display: 'block', marginTop: spacing.xs, color: 'var(--text-primary)', fontSize: typography.size.sm }}>{value}</strong></div>)}
        </div>
      </Section>

      <Section title="Controles" description="Estados essenciais para ações, formulários e filtros.">
        <div style={{ ...panelStyle, display: 'flex', gap: spacing.sm, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" style={{ ...buttonStyle, background: palette.brand.primary, color: '#fff' }}>Ação principal</button>
          <button type="button" style={{ ...buttonStyle, background: 'transparent', color: palette.brand.primary, border: `1px solid ${palette.brand.primary}` }}>Ação secundária</button>
          <button type="button" style={{ ...buttonStyle, background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>Neutro</button>
          <input aria-label="Campo de exemplo" placeholder="Campo de formulário" style={{ width: 220, minHeight: density.controlHeight, padding: density.controlPadding, border: '1px solid var(--border-strong)', borderRadius: radius.sm, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm }} />
        </div>
      </Section>

      <Section title="Estados e tabela" description="Mensagens e linhas seguem a mesma escala compacta para leitura operacional.">
        <div style={{ ...panelStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', padding: density.panelPadding, borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: palette.state.success, fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}>Publicado</span>
            <span style={{ color: palette.state.warning, fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}>Em revisão</span>
            <span style={{ color: palette.state.danger, fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}>Atenção necessária</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.size.sm }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>{['Elemento', 'Token', 'Uso'].map((heading) => <th key={heading} style={{ padding: density.tableHeaderPadding, textAlign: 'left', color: 'var(--text-secondary)', fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{heading}</th>)}</tr></thead>
            <tbody>{[['Painel', 'radius.md', 'Agrupa conteúdo relacionado'], ['Linha', 'density.tableCellPadding', 'Lista de leitura rápida'], ['Ação', 'radius.sm', 'Botões e campos']].map(([element, token, use]) => <tr key={element} style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: density.tableCellPadding, color: 'var(--text-primary)', fontWeight: typography.weight.semibold }}>{element}</td><td style={{ padding: density.tableCellPadding, color: palette.brand.light }}>{token}</td><td style={{ padding: density.tableCellPadding, color: 'var(--text-secondary)' }}>{use}</td></tr>)}</tbody>
          </table>
        </div>
      </Section>

      <Section title="Temas" description="Os mesmos componentes funcionam nos temas claro e escuro sem alterar a escala.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md }}>
          {[['Dark', darkTheme], ['Light', lightTheme]].map(([name, theme]) => <div key={name as string} style={{ ...panelStyle, background: (theme as typeof darkTheme).bg.surface, color: (theme as typeof darkTheme).text.primary }}><strong style={{ display: 'block', fontSize: typography.size.md }}>{name as string}</strong><span style={{ display: 'block', marginTop: spacing.xs, color: (theme as typeof darkTheme).text.secondary, fontSize: typography.size.sm }}>Surface {((theme as typeof darkTheme).bg.surface)}</span><span style={{ display: 'block', marginTop: spacing.xs, color: (theme as typeof darkTheme).text.muted, fontSize: typography.size.xs }}>Muted text {((theme as typeof darkTheme).text.muted)}</span></div>)}
        </div>
      </Section>
    </div>
  </AdminMainLayout>
);

export default AdminDesignSystemPage;
