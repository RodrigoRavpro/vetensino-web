import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { InstructorMainLayout } from '../../components/instructor/InstructorMainLayout';
import { CourseEditor } from '../admin/CourseEditor';
import { density, palette, radius, spacing, typography } from '../../styles/designSystem';

type CourseClass = { id: string; name: string; capacity: number; status: string; seatsRemaining: number };
type Course = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string | null;
  price: string;
  promoPrice?: string | null;
  status: string;
  workloadHours: number | null;
  instructorId: string | null;
  contentJson?: Record<string, unknown> | null;
  classes: CourseClass[];
  enrollmentsCount: number;
  revenue: number;
};
type CourseForm = { title: string; slug: string; description: string; price: string; workloadHours: string; className: string; capacity: string };

const initialForm: CourseForm = { title: '', slug: '', description: '', price: '0', workloadHours: '', className: '', capacity: '20' };
const panelStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.md, boxShadow: '0 1px 4px rgba(16, 24, 40, 0.04)' };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, minHeight: density.controlHeight, padding: density.controlPadding, border: '1px solid var(--border-strong)', borderRadius: radius.sm, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, outline: 'none' };
const labelStyle = { display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold };
const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const InstructorDashboardPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<CourseForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [editorCourse, setEditorCourse] = useState<Course | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ courses: Course[] }>('/instructor/courses');
      setCourses(response.data.courses);
    } catch {
      setMessage('Não foi possível carregar seus cursos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadCourses(); }, []);

  const updateField = (field: keyof CourseForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const openCreate = () => { setForm(initialForm); setMessage(''); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(initialForm); };

  const createCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.post('/instructor/courses', {
        slug: form.slug,
        title: form.title,
        description: form.description || null,
        price: Number(form.price),
        workloadHours: form.workloadHours ? Number(form.workloadHours) : null,
        classes: [{ name: form.className, capacity: Number(form.capacity), format: 'ONLINE' }],
      });
      closeForm();
      setMessage('Curso criado com sucesso.');
      await loadCourses();
    } catch {
      setMessage('Não foi possível criar o curso. Verifique os dados informados.');
    } finally {
      setSaving(false);
    }
  };

  const publishCourse = async (course: Course) => {
    if (!window.confirm(`Publicar o curso "${course.title}"?`)) return;
    try { await api.post(`/instructor/courses/${course.id}/publish`); setMessage('Curso publicado com sucesso.'); await loadCourses(); }
    catch { setMessage('Não foi possível publicar o curso. Verifique se há título, preço e ao menos uma turma.'); }
  };

  const archiveCourse = async (course: Course) => {
    if (!window.confirm(`Arquivar o curso "${course.title}"?`)) return;
    try { await api.post(`/instructor/courses/${course.id}/archive`); setMessage('Curso arquivado com sucesso.'); await loadCourses(); }
    catch { setMessage('Não foi possível arquivar o curso.'); }
  };

  const deleteCourse = async (course: Course) => {
    if (!window.confirm(`Excluir permanentemente "${course.title}"? Esta ação só funciona sem matrículas ou pedidos.`)) return;
    try { await api.delete(`/instructor/courses/${course.id}`); setMessage('Curso excluído com sucesso.'); await loadCourses(); }
    catch { setMessage('Curso possui histórico ou não pode ser excluído. Arquive-o em vez disso.'); }
  };

  if (editorCourse) {
    return (
      <InstructorMainLayout breadcrumb={[{ label: 'Meus cursos', to: '/instructor/cursos' }, { label: editorCourse.title }]}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.xl, lineHeight: 1.2, fontWeight: typography.weight.semibold }}>{editorCourse.title}</h1>
          <button type="button" onClick={() => setEditorCourse(null)} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: 'transparent', color: palette.brand.primary, fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>Voltar aos meus cursos</button>
        </header>
        <CourseEditor course={editorCourse} basePath="/instructor/courses" showInstructorField={false} onClose={() => setEditorCourse(null)} onSaved={loadCourses} />
      </InstructorMainLayout>
    );
  }

  return (
    <InstructorMainLayout breadcrumb={[{ label: 'Meus cursos' }]}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: spacing.xs }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.xl, lineHeight: 1.2, fontWeight: typography.weight.semibold }}>Meus cursos</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, lineHeight: 1.4 }}>Crie, edite e publique seus cursos. Você é o único responsável pelo conteúdo.</p>
        </div>
        <button type="button" onClick={openCreate} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: palette.brand.primary, color: '#fff', fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>+ Novo curso</button>
      </header>

      {message && <div role="status" style={{ ...panelStyle, padding: `${spacing.sm} ${spacing.md}`, color: message.includes('Não') ? '#b42318' : '#149e61', fontSize: typography.size.sm }}>{message}</div>}

      {showForm && <form onSubmit={createCourse} style={{ ...panelStyle, padding: density.panelPadding, display: 'grid', gap: density.sectionGap }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }}><h2 style={{ margin: 0, fontFamily: typography.fontFamily, fontSize: typography.size.md, fontWeight: typography.weight.semibold }}>Novo curso</h2><button type="button" onClick={closeForm} style={{ border: 0, background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: typography.fontFamily }}>Cancelar</button></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: density.sectionGap }}>
          <label style={labelStyle}>Título<input required value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Ex.: Medicina Veterinária" style={inputStyle} /></label>
          <label style={labelStyle}>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder="medicina-veterinaria" style={inputStyle} /></label>
          <label style={labelStyle}>Preço<input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Carga horária (horas)<input type="number" min="1" value={form.workloadHours} onChange={(event) => updateField('workloadHours', event.target.value)} style={inputStyle} /></label>
          <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>Descrição<textarea rows={3} value={form.description} onChange={(event) => updateField('description', event.target.value)} style={{ ...inputStyle, resize: 'vertical' }} /></label>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: density.sectionGap, display: 'grid', gridTemplateColumns: '1fr 180px', gap: density.sectionGap }}>
          <label style={labelStyle}>Primeira turma<input required value={form.className} onChange={(event) => updateField('className', event.target.value)} placeholder="Turma Agosto 2026" style={inputStyle} /></label>
          <label style={labelStyle}>Limite de vagas<input required type="number" min="1" value={form.capacity} onChange={(event) => updateField('capacity', event.target.value)} style={inputStyle} /></label>
        </div>
        <div><button type="submit" disabled={saving} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.lg}`, background: palette.brand.primary, color: '#fff', fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Salvando...' : 'Salvar curso'}</button></div>
      </form>}

      <section style={{ ...panelStyle, overflow: 'hidden' }}>
        {!loading && courses.length === 0 && !showForm && (
          <div style={{ padding: `calc(${density.panelPadding} * 3)`, textAlign: 'center', display: 'grid', gap: spacing.md, justifyItems: 'center' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>Você ainda não criou nenhum curso.</p>
            <button type="button" onClick={openCreate} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: palette.brand.primary, color: '#fff', fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>Criar meu primeiro curso</button>
          </div>
        )}
        {(loading || courses.length > 0) && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                  {['Curso', 'Turmas', 'Inscritos', 'Receita', 'Status', 'Ações'].map((heading) => (
                    <th key={heading} style={{ textAlign: heading === 'Ações' ? 'right' : 'left', padding: `${spacing.sm} ${spacing.md}`, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: spacing.md, fontSize: typography.size.sm }}>
                      <strong style={{ fontWeight: typography.weight.semibold }}>{course.title}</strong>
                      <div style={{ marginTop: spacing.xs, color: 'var(--text-muted)', fontSize: typography.size.xs }}>{course.slug}</div>
                      {course.status === 'PUBLISHED' && <a href={`/cursos/${course.slug}`} target="_blank" rel="noreferrer" style={{ color: palette.brand.primary, fontSize: typography.size.xs, textDecoration: 'none' }}>Ver página do curso ↗</a>}
                    </td>
                    <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{course.classes.length} · {course.classes.reduce((total, item) => total + item.seatsRemaining, 0)} vagas restantes</td>
                    <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{course.enrollmentsCount}</td>
                    <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{currency(course.revenue)}</td>
                    <td style={{ padding: spacing.md, color: course.status === 'PUBLISHED' ? '#149e61' : 'var(--text-secondary)', fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}>{course.status === 'DRAFT' ? 'Rascunho' : course.status === 'PUBLISHED' ? 'Publicado' : 'Arquivado'}</td>
                    <td style={{ padding: spacing.md, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button type="button" onClick={() => setEditorCourse(course)} style={{ border: `1px solid var(--border-subtle)`, borderRadius: radius.sm, background: 'transparent', color: palette.brand.primary, padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Editar</button>
                      <Link to={`/instructor/inscricoes?courseId=${course.id}`} style={{ color: palette.brand.primary, fontSize: typography.size.xs, padding: `${spacing.xs} ${spacing.sm}`, textDecoration: 'none' }}>Ver inscritos</Link>
                      {course.status === 'DRAFT' && <button type="button" onClick={() => void publishCourse(course)} style={{ border: 0, background: 'transparent', color: palette.brand.primary, padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Publicar</button>}
                      {course.status !== 'ARCHIVED' && <button type="button" onClick={() => void archiveCourse(course)} style={{ border: 0, background: 'transparent', color: '#c6364d', padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Arquivar</button>}
                      <button type="button" onClick={() => void deleteCourse(course)} style={{ border: 0, background: 'transparent', color: '#c6364d', padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Carregando cursos...</p>}
          </div>
        )}
      </section>
    </InstructorMainLayout>
  );
};

export default InstructorDashboardPage;
