import { useState, type ReactNode } from 'react';
import { AdminMainLayout } from '../../components/admin/AdminMainLayout';
import { Alert, Badge, Button, CourseCard, DemoPanel, Field, FileUpload, Input, Modal, Progress, Select, Tabs, Textarea } from '../../components/ui/DesignSystemPrimitives';
import { darkTheme, density, lightTheme, palette, radius, spacing, typography } from '../../styles/designSystem';

const sectionStyle = { display: 'grid', gap: spacing.md, scrollMarginTop: spacing.lg };
const labelStyle = { color: 'var(--text-muted)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, letterSpacing: '0.04em', textTransform: 'uppercase' as const };

const Section = ({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) => <section id={id} style={sectionStyle}><div><h2 style={{ margin: 0, fontSize: typography.size.lg }}>{title}</h2><p style={{ margin: `${spacing.xs} 0 0`, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{description}</p></div>{children}</section>;

const Swatch = ({ name, value }: { name: string; value: string }) => <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: spacing.sm, alignItems: 'center' }}><div aria-hidden="true" style={{ width: 40, height: 40, borderRadius: radius.sm, background: value, border: '1px solid var(--border-subtle)' }} /><div><strong style={{ display: 'block', fontSize: typography.size.sm }}>{name}</strong><span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs }}>{value}</span></div></div>;

const ThemePreview = ({ name, theme }: { name: string; theme: typeof darkTheme | typeof lightTheme }) => <div style={{ background: theme.bg.base, color: theme.text.primary, border: `1px solid ${theme.border.subtle}`, borderRadius: radius.md, padding: spacing.md, display: 'grid', gap: spacing.sm }}><strong>{name}</strong><span style={{ color: theme.text.secondary, fontSize: typography.size.sm }}>Superfície de conteúdo</span><div style={{ background: theme.bg.surface, border: `1px solid ${theme.border.subtle}`, borderRadius: radius.sm, padding: spacing.sm, color: theme.text.muted, fontSize: typography.size.xs }}>Texto auxiliar e hierarquia</div></div>;

export const AdminDesignSystemPage = () => {
  const [activeTab, setActiveTab] = useState('Visão geral');
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);

  return <AdminMainLayout breadcrumb={[{ label: 'Design system' }]}>
    <header style={{ display: 'grid', gap: spacing.sm, maxWidth: 760 }}>
      <span style={{ ...labelStyle, color: palette.brand.light }}>VetEnsino · biblioteca visual</span>
      <h1 style={{ margin: 0, fontSize: typography.size.xxl, lineHeight: 1.1 }}>Componentes para ensinar, aprender e acompanhar progresso</h1>
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: typography.size.md, lineHeight: 1.5 }}>Uma referência viva para construir experiências de cursos com clareza, ritmo e feedback em cada etapa.</p>
    </header>

    <nav aria-label="Seções do design system" style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', padding: `${spacing.sm} 0`, borderBottom: '1px solid var(--border-subtle)' }}>
      {['Fundamentos', 'Formulários', 'Feedback', 'Ensino', 'Dados'].map((item) => <a key={item} href={`#${item.toLowerCase()}`} style={{ padding: `${spacing.xs} ${spacing.sm}`, borderRadius: radius.pill, background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{item}</a>)}
    </nav>

    <div style={{ display: 'grid', gap: spacing.xxl }}>
      <Section id="fundamentos" title="Fundamentos" description="Tokens que dão consistência à experiência de aprendizagem e à operação administrativa.">
        <DemoPanel style={{ display: 'grid', gap: spacing.lg }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: spacing.md }}>{[[palette.brand.primary, 'Marca'], [palette.state.success, 'Sucesso'], [palette.state.warning, 'Atenção'], [palette.state.danger, 'Erro'], [palette.state.info, 'Informação']].map(([value, name]) => <Swatch key={name} name={name} value={value} />)}</div><div style={{ display: 'grid', gap: spacing.sm }}>{Object.entries(typography.size).map(([name, value]) => <div key={name} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: spacing.md, alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: spacing.sm }}><span style={{ ...labelStyle, letterSpacing: 0 }}>{name}</span><span style={{ fontSize: value }}>VetEnsino</span></div>)}</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md }}><ThemePreview name="Dark preview" theme={darkTheme} /><ThemePreview name="Light preview" theme={lightTheme} /></div></DemoPanel>
      </Section>

      <Section id="formulários" title="Formulários" description="Campos com hierarquia, ajuda contextual e erro visível para criação de cursos e aulas.">
        <DemoPanel style={{ display: 'grid', gap: spacing.md, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}><Field label="Título da aula" hint="Use um nome específico e fácil de encontrar."><Input placeholder="Ex.: Introdução à ultrassonografia" /></Field><Field label="Módulo"><Select defaultValue=""><option value="" disabled>Selecione o módulo</option><option>Fundamentos</option><option>Prática clínica</option></Select></Field><Field label="Descrição" error={formError}><Textarea placeholder="O que o aluno vai aprender?" /></Field><div style={{ display: 'flex', gap: spacing.sm, alignItems: 'end', flexWrap: 'wrap' }}><Button onClick={() => setFormError('Informe uma descrição antes de publicar.')}>Validar formulário</Button><Button variant="secondary">Salvar rascunho</Button></div></DemoPanel>
      </Section>

      <Section id="feedback" title="Feedback e estados" description="O produto deve sempre explicar o que aconteceu e qual é o próximo passo.">
        <DemoPanel style={{ display: 'grid', gap: spacing.sm }}><Alert title="Curso publicado" tone="success">O conteúdo já está disponível para os alunos matriculados.</Alert><Alert title="Revisão necessária" tone="warning">Adicione pelo menos uma aula ao módulo antes de publicar.</Alert><Alert title="Falha ao salvar" tone="danger">Verifique sua conexão e tente novamente.</Alert><div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}><Badge tone="success">Publicado</Badge><Badge tone="warning">Em revisão</Badge><Badge tone="danger">Bloqueado</Badge><Badge>Rascunho</Badge><Button loading>Salvando</Button><Button disabled>Indisponível</Button></div></DemoPanel>
      </Section>

      <Section id="ensino" title="Ensino" description="Padrões que tornam a jornada do aluno visível, mensurável e acionável.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: spacing.md }}><CourseCard title="Imagem diagnóstica na prática" category="Ultrassonografia" progress={68} /><CourseCard title="Gestão de uma clínica moderna" category="Negócios" progress={32} /></div>
        <DemoPanel style={{ display: 'grid', gap: spacing.md }}><Tabs items={['Visão geral', 'Aulas', 'Materiais']} active={activeTab} onChange={setActiveTab} /><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>Conteúdo da aba <strong>{activeTab}</strong>: módulos, aulas e materiais podem compartilhar a mesma navegação.</p><Progress value={68} label="Jornada do aluno" /><div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}><Badge tone="success">Aula 4 concluída</Badge><span style={{ color: 'var(--text-secondary)', fontSize: typography.size.sm }}>Aula 5 · Doppler e interpretação clínica</span><Button variant="secondary">Abrir aula</Button></div></DemoPanel>
        <DemoPanel style={{ display: 'grid', gap: spacing.sm }}><FileUpload />{uploadComplete ? <Alert title="Material pronto" tone="success">O material foi anexado ao módulo.</Alert> : <Button variant="ghost" onClick={() => setUploadComplete(true)}>Simular material processado</Button>}</DemoPanel>
      </Section>

      <Section id="dados" title="Dados e sobreposições" description="Ferramentas para operar catálogo, usuários e conteúdos sem perder contexto.">
        <DemoPanel style={{ padding: 0, overflow: 'hidden' }}><div style={{ padding: density.panelPadding, display: 'flex', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)' }}><div><strong>Alunos recentes</strong><p style={{ margin: `${spacing.xs} 0 0`, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>Acompanhamento da turma de setembro</p></div><Button onClick={() => setModalOpen(true)}>Convidar aluno</Button></div><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.size.sm }}><thead><tr>{['Aluno', 'Curso', 'Progresso', 'Status'].map((heading) => <th key={heading} style={{ padding: density.tableHeaderPadding, textAlign: 'left', color: 'var(--text-muted)', fontSize: typography.size.xs, textTransform: 'uppercase' }}>{heading}</th>)}</tr></thead><tbody>{[['Marina Costa', 'Imagem diagnóstica', '82%', 'Ativo'], ['Rafael Lima', 'Gestão de clínica', '45%', 'Ativo'], ['Camila Rocha', 'Imagem diagnóstica', '100%', 'Concluído']].map(([name, course, progress, status]) => <tr key={name} style={{ borderTop: '1px solid var(--border-subtle)' }}><td style={{ padding: density.tableCellPadding, fontWeight: typography.weight.semibold }}>{name}</td><td style={{ padding: density.tableCellPadding, color: 'var(--text-secondary)' }}>{course}</td><td style={{ padding: density.tableCellPadding, color: 'var(--text-secondary)' }}>{progress}</td><td style={{ padding: density.tableCellPadding }}><Badge tone={status === 'Concluído' ? 'success' : 'brand'}>{status}</Badge></td></tr>)}</tbody></table></div></DemoPanel>
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}><Button variant="secondary">Anterior</Button><Button>1</Button><Button variant="ghost">2</Button><Button variant="ghost">Próxima</Button><Button variant="danger">Excluir conteúdo</Button></div>
      </Section>
    </div>
    <Modal open={modalOpen} title="Convidar aluno" onClose={() => setModalOpen(false)}><Field label="E-mail do aluno" hint="Enviaremos um convite para acessar o curso."><Input type="email" placeholder="aluno@exemplo.com" /></Field><div style={{ display: 'flex', justifyContent: 'end', gap: spacing.sm }}><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={() => setModalOpen(false)}>Enviar convite</Button></div></Modal>
  </AdminMainLayout>;
};

export default AdminDesignSystemPage;
