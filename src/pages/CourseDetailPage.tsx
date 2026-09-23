import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { spacing, radius, typography } from '../styles/designSystem';
import BrandLogo from '../components/BrandLogo';

type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverImageUrl: string | null;
  price: string;
  promoPrice: string | null;
  workloadHours: number | null;
  certificateEnabled: boolean;
  contentJson: Record<string, unknown> | null;
  classes: Array<{ id: string; name: string; capacity: number; format: string }>;
};

type CourseBlock = { id: string; type: 'text' | 'image' | 'outcomes' | 'syllabus' | 'bonuses'; title: string; body: string; imageUrl: string; items: string[] };
type RegistrationField = 'name' | 'email' | 'phone' | 'company';
type Sponsor = { id: string; logoUrl: string; name: string; size: 'small' | 'medium' | 'large' };
const isRegistrationField = (field: unknown): field is RegistrationField => ['name', 'email', 'phone', 'company'].includes(String(field));

const listValue = (content: Record<string, unknown>, key: string, fallback: string[]): string[] => {
  const value = content[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
};

const sponsorsValue = (content: Record<string, unknown>): Sponsor[] => {
  const sponsors = content.sponsors;
  if (!Array.isArray(sponsors)) return [];
  return sponsors.filter((item): item is Sponsor => {
    if (!item || typeof item !== 'object' || typeof (item as Sponsor).id !== 'string' || typeof (item as Sponsor).logoUrl !== 'string') return false;
    try { return ['http:', 'https:'].includes(new URL((item as Sponsor).logoUrl).protocol); } catch { return false; }
  }).map((sponsor) => ({ id: sponsor.id, logoUrl: sponsor.logoUrl, name: typeof sponsor.name === 'string' ? sponsor.name.slice(0, 120) : '', size: sponsor.size === 'small' || sponsor.size === 'large' ? sponsor.size : 'medium' }));
};

const blocksValue = (content: Record<string, unknown>, outcomes: string[], syllabus: string[], bonuses: string[]): CourseBlock[] => {
  const blocks = content.blocks;
  if (Array.isArray(blocks)) return blocks.filter((item): item is CourseBlock => Boolean(item && typeof item === 'object' && typeof (item as CourseBlock).id === 'string'));
  return [
    { id: 'outcomes', type: 'outcomes', title: 'Você vai aprender', body: '', imageUrl: '', items: outcomes },
    { id: 'syllabus', type: 'syllabus', title: 'Programa', body: '', imageUrl: '', items: syllabus },
    { id: 'bonuses', type: 'bonuses', title: 'Bônus', body: '', imageUrl: '', items: bonuses },
  ];
};

export const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<RegistrationField, string>>({ name: '', email: '', phone: '', company: '' });
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!slug) return;
    void api.get<{ course: Course }>(`/courses/${slug}`).then((response) => setCourse(response.data.course)).catch(() => setCourse(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Carregando curso...</main>;
  if (!course) return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Curso não encontrado.</main>;

  const content = course.contentJson ?? {};
  const outcomes = listValue(content, 'outcomes', ['Conteúdo prático e aplicável']);
  const syllabus = listValue(content, 'syllabus', ['Fundamentos do curso']);
  const bonuses = listValue(content, 'bonuses', ['Material complementar']);
  const audience = typeof content.audience === 'string' ? content.audience : 'Profissionais que desejam evoluir sua prática.';
  const eyebrow = typeof content.eyebrow === 'string' ? content.eyebrow : '';
  const heroImageUrl = typeof content.heroImageUrl === 'string' ? content.heroImageUrl : '';
  const preRegistrationEnabled = content.preRegistrationEnabled !== false;
  const preRegistrationTitle = typeof content.preRegistrationTitle === 'string' ? content.preRegistrationTitle : 'Garanta seu lugar';
  const preRegistrationDescription = typeof content.preRegistrationDescription === 'string' ? content.preRegistrationDescription : 'Deixe seu contato e receba as próximas informações.';
  const preRegistrationButtonLabel = typeof content.preRegistrationButtonLabel === 'string' ? content.preRegistrationButtonLabel : 'Quero ser avisado';
  const preRegistrationFields: RegistrationField[] = Array.isArray(content.preRegistrationFields) ? content.preRegistrationFields.filter(isRegistrationField) : ['name', 'email'];
  const blocks = blocksValue(content, outcomes, syllabus, bonuses);
  const sponsors = sponsorsValue(content);
  const selectedClass = course.classes[0];

  const submitPreRegistration = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    setMessage('');
    try {
      await api.post(`/courses/${course.slug}/pre-registration`, form);
      setMessage('Cadastro enviado. Em breve entraremos em contato.');
      setForm({ name: '', email: '', phone: '', company: '' });
    } catch {
      setMessage('Não foi possível enviar agora. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const setRegistrationValue = (field: RegistrationField, value: string) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <section style={{ maxWidth: 900, margin: '0 auto', padding: `${spacing.xxl} ${spacing.xl} 0`, display: 'grid', gap: spacing.lg }}>
        {heroImageUrl && <img src={heroImageUrl} alt="" style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: radius.xl }} />}
        {course.coverImageUrl && <img src={course.coverImageUrl} alt="" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: radius.xl }} />}
        {eyebrow && <span style={{ color: 'var(--brand-light)', fontSize: typography.size.sm, fontWeight: typography.weight.bold, textTransform: 'uppercase' }}>{eyebrow}</span>}
        <h1 style={{ margin: 0, fontSize: 'clamp(2.4rem, 4vw, 4rem)', lineHeight: 1.1 }}>{course.title}</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: typography.size.lg, lineHeight: 1.7 }}>{course.subtitle}</p>
        {course.description && <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: course.description }} />}
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}><span style={{ padding: `${spacing.sm} ${spacing.md}`, borderRadius: radius.pill, background: 'var(--brand-subtle)' }}>{course.workloadHours ?? 0}h</span><span style={{ padding: `${spacing.sm} ${spacing.md}`, borderRadius: radius.pill, background: 'var(--brand-subtle)' }}>{selectedClass?.name ?? 'Turma aberta'}</span><span style={{ padding: `${spacing.sm} ${spacing.md}`, borderRadius: radius.pill, background: 'var(--brand-subtle)' }}>{selectedClass?.capacity ?? 0} vagas</span></div>
        {outcomes.length > 0 && <div style={{ paddingTop: spacing.lg, borderTop: '1px solid var(--border-subtle)' }}><h2 style={{ margin: `0 0 ${spacing.sm}` }}>Você vai aprender</h2><ul style={{ margin: 0, paddingLeft: spacing.lg, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{outcomes.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {bonuses.length > 0 && <div style={{ paddingTop: spacing.lg, borderTop: '1px solid var(--border-subtle)' }}><h2 style={{ margin: `0 0 ${spacing.sm}` }}>Bônus</h2><ul style={{ margin: 0, paddingLeft: spacing.lg, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{bonuses.map((bonus) => <li key={bonus}>{bonus}</li>)}</ul></div>}
      </section>
      <section style={{ maxWidth: 900, margin: '0 auto', padding: `0 ${spacing.xl} ${spacing.xxl}`, display: 'grid', gap: spacing.xl }}>
        <div style={{ paddingTop: spacing.xl, borderTop: '1px solid var(--border-subtle)' }}><h2 style={{ margin: `0 0 ${spacing.sm}` }}>Para quem é</h2><p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{audience}</p></div>
        {blocks.map((block) => <section key={block.id} style={{ paddingTop: spacing.xl, borderTop: '1px solid var(--border-subtle)' }}><h2 style={{ margin: `0 0 ${spacing.sm}` }}>{block.title}</h2>{block.type === 'text' && <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: block.body }} />}{block.type === 'image' && block.imageUrl && <img src={block.imageUrl} alt={block.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: radius.md }} />}{['outcomes', 'syllabus', 'bonuses'].includes(block.type) && <ul style={{ margin: 0, paddingLeft: spacing.lg, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
        {sponsors.length > 0 && <section style={{ paddingTop: spacing.xl, borderTop: '1px solid var(--border-subtle)' }}><h2 style={{ margin: `0 0 ${spacing.sm}` }}>Patrocínio e apoio</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: spacing.md, alignItems: 'center' }}>{sponsors.map((sponsor) => <div key={sponsor.id} style={{ display: 'grid', gap: spacing.xs, justifyItems: 'center', padding: spacing.md, border: '1px solid var(--border-subtle)', borderRadius: radius.md, background: '#fff' }}><img src={sponsor.logoUrl} alt={sponsor.name || 'Patrocinador'} style={{ width: sponsor.size === 'large' ? '100%' : sponsor.size === 'small' ? '55%' : '78%', height: 64, objectFit: 'contain' }} />{sponsor.name && <span style={{ color: 'var(--text-muted)', fontSize: typography.size.sm, textAlign: 'center' }}>{sponsor.name}</span>}</div>)}</div></section>}
        <section style={{ paddingTop: spacing.xl, borderTop: '1px solid var(--border-subtle)', display: 'grid', gap: spacing.md, justifyItems: 'center', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Investimento</span>
          <strong style={{ fontSize: '2.4rem' }}>R$ {course.promoPrice ?? course.price}</strong>
          <button type="button" onClick={() => selectedClass && navigate('/checkout', { state: { courseId: course.id, classId: selectedClass.id, courseTitle: course.title, className: selectedClass.name, total: course.promoPrice ?? course.price } })} disabled={!selectedClass} style={{ border: 0, borderRadius: radius.pill, padding: `${spacing.md} ${spacing.lg}`, background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-light))', color: '#fff', fontWeight: typography.weight.bold, cursor: 'pointer' }}>Fazer pré-inscrição</button>
        </section>
      </section>
      {preRegistrationEnabled && <section style={{ maxWidth: 760, margin: '0 auto', padding: `0 ${spacing.xl} ${spacing.xxl}` }}><form onSubmit={submitPreRegistration} style={{ padding: spacing.xl, borderRadius: radius.xl, background: 'var(--bg-elevated)', display: 'grid', gap: spacing.md }}><h2 style={{ margin: 0 }}>{preRegistrationTitle}</h2><p style={{ margin: 0, color: 'var(--text-secondary)' }}>{preRegistrationDescription}</p>{preRegistrationFields.map((field) => <input key={field} required={field === 'name' || field === 'email'} minLength={field === 'name' ? 2 : undefined} maxLength={field === 'phone' ? 30 : 240} type={field === 'email' ? 'email' : 'text'} placeholder={{ name: 'Seu nome', email: 'Seu e-mail', phone: 'Seu telefone', company: 'Sua empresa' }[field]} value={form[field] ?? ''} onChange={(event) => setRegistrationValue(field, event.target.value)} />)}<button type="submit" disabled={sending} style={{ border: 0, borderRadius: radius.pill, padding: spacing.md, background: 'var(--brand-primary)', color: '#fff', fontWeight: typography.weight.bold }}>{sending ? 'Enviando...' : preRegistrationButtonLabel}</button>{message && <span>{message}</span>}</form></section>}
      <style>{'.course-footer-logo{filter:grayscale(1);opacity:0.5;transition:filter .2s ease,opacity .2s ease}.course-footer-logo:hover,.course-footer-logo:focus-visible{filter:none;opacity:1}'}</style>
      <div style={{ padding: `${spacing.xxl} ${spacing.xl}`, display: 'grid', justifyItems: 'center' }}><button type="button" onClick={() => navigate('/')} className="course-footer-logo" style={{ border: 0, background: 'transparent', cursor: 'pointer' }}><BrandLogo size="sm" align="center" compact /></button></div>
    </main>
  );
};

export default CourseDetailPage;
