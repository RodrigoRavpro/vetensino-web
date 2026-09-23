import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../../services/api';
import { AdminMainLayout } from '../../components/admin/AdminMainLayout';
import { CourseEditor } from './CourseEditor';
import { density, palette, radius, spacing, typography } from '../../styles/designSystem';

type CourseClass = { id: string; name: string; capacity: number; status: string };
type Course = { id: string; title: string; slug: string; subtitle?: string | null; description: string | null; price: string; promoPrice?: string | null; status: string; workloadHours: number | null; instructorId: string | null; contentJson?: Record<string, unknown> | null; classes: CourseClass[] };
type Teacher = { id: string; name: string; email: string };
type CourseForm = { title: string; slug: string; description: string; price: string; workloadHours: string; instructorId: string; className: string; capacity: string };

const initialForm: CourseForm = { title: '', slug: '', description: '', price: '0', workloadHours: '', instructorId: '', className: '', capacity: '20' };
const panelStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.md, boxShadow: '0 1px 4px rgba(16, 24, 40, 0.04)' };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, minHeight: density.controlHeight, padding: density.controlPadding, border: '1px solid var(--border-strong)', borderRadius: radius.sm, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, outline: 'none' };
const labelStyle = { display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold };

export const AdminCoursesEnterprisePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [form, setForm] = useState<CourseForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [editorCourse, setEditorCourse] = useState<Course | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ courses: Course[] }>('/admin/courses');
      const result = response.data.courses.filter((course) => !status || course.status === status).filter((course) => !search || `${course.title} ${course.slug}`.toLowerCase().includes(search.toLowerCase()));
      setCourses(result);
    } catch {
      setMessage('Não foi possível carregar os cursos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadCourses(); }, [status]);

  useEffect(() => {
    void api.get<{ users: Teacher[] }>('/admin/users', { params: { role: 'TEACHER', limit: 100 } })
      .then((response) => setTeachers(response.data.users))
      .catch(() => setMessage('Não foi possível carregar os docentes.'));
  }, []);

  useEffect(() => {
    if (loading) return;
    const rows = document.querySelectorAll<HTMLElement>('.admin-course-list tbody tr');
    const links: HTMLAnchorElement[] = [];

    courses.forEach((course, index) => {
      if (course.status !== 'PUBLISHED') return;
      const actionsCell = rows[index]?.lastElementChild;
      if (!actionsCell || actionsCell.querySelector(`[data-course-access="${course.id}"]`)) return;

      const link = document.createElement('a');
      link.dataset.courseAccess = course.id;
      link.href = `/cursos/${course.slug}`;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = 'Acessar';
      link.style.color = palette.brand.primary;
      link.style.fontSize = typography.size.xs;
      link.style.marginRight = '6px';
      link.style.textDecoration = 'none';
      actionsCell.insertBefore(link, actionsCell.firstChild);
      links.push(link);
    });

    return () => links.forEach((link) => link.remove());
  }, [courses, loading]);

  const updateField = (field: keyof CourseForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const openCreate = () => { setEditingId(null); setForm(initialForm); setMessage(''); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(initialForm); };

  const openEdit = (course: Course) => {
    setEditorCourse(course);
    setShowForm(false);
    return;
    /* Legacy compact edit form retained below for reference. */
    const firstClass = course.classes[0];
    setEditingId(course.id);
    setForm({ title: course.title, slug: course.slug, description: course.description ?? '', price: course.price, workloadHours: course.workloadHours?.toString() ?? '', instructorId: course.instructorId ?? '', className: firstClass?.name ?? '', capacity: firstClass?.capacity.toString() ?? '20' });
    setMessage('');
    setShowForm(true);
  };

  const createCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        description: form.description || null,
        price: Number(form.price),
        workloadHours: form.workloadHours ? Number(form.workloadHours) : null,
        instructorId: form.instructorId,
      };
      if (editingId) {
        await api.patch(`/admin/courses/${editingId}`, payload);
        if (form.className) {
          const current = courses.find((course) => course.id === editingId)?.classes[0];
          if (current) await api.patch(`/admin/courses/${editingId}/classes/${current.id}`, { name: form.className, capacity: Number(form.capacity) });
        }
      } else {
        await api.post('/admin/courses', { ...payload, classes: [{ name: form.className, capacity: Number(form.capacity), format: 'ONLINE' }] });
      }
      closeForm();
      setMessage(editingId ? 'Curso atualizado com sucesso.' : 'Curso criado com sucesso.');
      await loadCourses();
    } catch {
      setMessage('Não foi possível criar o curso. Verifique os dados informados.');
    } finally {
      setSaving(false);
    }
  };

  const publishCourse = async (course: Course) => {
    if (!window.confirm(`Publicar o curso "${course.title}"?`)) return;
    try {
      await api.post(`/admin/courses/${course.id}/publish`);
      setMessage('Curso publicado com sucesso.');
      await loadCourses();
    } catch {
      setMessage('Não foi possível publicar o curso.');
    }
  };

  const archiveCourse = async (course: Course) => {
    if (!window.confirm(`Arquivar o curso "${course.title}"?`)) return;
    try { await api.post(`/admin/courses/${course.id}/archive`); setMessage('Curso arquivado com sucesso.'); await loadCourses(); }
    catch { setMessage('Não foi possível arquivar o curso.'); }
  };

  const deleteCourse = async (course: Course) => {
    if (!window.confirm(`Excluir permanentemente "${course.title}"? Esta ação só funciona sem matrículas ou pedidos.`)) return;
    try { await api.delete(`/admin/courses/${course.id}`); setMessage('Curso excluído com sucesso.'); await loadCourses(); }
    catch { setMessage('Curso possui histórico ou não pode ser excluído. Arquive-o em vez disso.'); }
  };

  if (editorCourse) {
    return (
      <AdminMainLayout breadcrumb={[{ label: 'Cursos', to: '/admin/cursos' }, { label: editorCourse.title }]}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }}>
          <div style={{ display: 'grid', gap: spacing.xs }}>
            <span style={{ color: 'var(--text-muted)', fontFamily: typography.fontFamily, fontSize: typography.size.xs, fontWeight: typography.weight.semibold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Editor dedicado</span>
            <h1 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.xl, lineHeight: 1.2, fontWeight: typography.weight.semibold }}>{editorCourse.title}</h1>
          </div>
          <button type="button" onClick={() => setEditorCourse(null)} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: 'transparent', color: palette.brand.primary, fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>Voltar aos cursos</button>
        </header>
        <CourseEditor course={editorCourse} onClose={() => setEditorCourse(null)} onSaved={async () => undefined} />
      </AdminMainLayout>
    );
  }

  return (
    <AdminMainLayout breadcrumb={[{ label: 'Cursos' }]}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: spacing.xs }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.xl, lineHeight: 1.2, fontWeight: typography.weight.semibold }}>Cursos</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, lineHeight: 1.4 }}>Gerencie cursos, turmas, carga horária e vagas.</p>
        </div>
        <button type="button" onClick={openCreate} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: palette.brand.primary, color: '#fff', fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>+ Novo curso</button>
      </header>

      {message && <div role="status" style={{ ...panelStyle, padding: `${spacing.sm} ${spacing.md}`, color: message.includes('Não') ? '#b42318' : '#149e61', fontSize: typography.size.sm }}>{message}</div>}

      {showForm && <form onSubmit={createCourse} style={{ ...panelStyle, padding: density.panelPadding, display: 'grid', gap: density.sectionGap }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }}><h2 style={{ margin: 0, fontFamily: typography.fontFamily, fontSize: typography.size.md, fontWeight: typography.weight.semibold }}>{editingId ? 'Editar curso' : 'Novo curso'}</h2><button type="button" onClick={closeForm} style={{ border: 0, background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: typography.fontFamily }}>Cancelar</button></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: density.sectionGap }}>
          <label style={labelStyle}>Título<input required value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Ex.: Medicina Veterinária" style={inputStyle} /></label>
          <label style={labelStyle}>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder="medicina-veterinaria" style={inputStyle} /></label>
          <label style={labelStyle}>Preço<input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Carga horária (horas)<input type="number" min="1" value={form.workloadHours} onChange={(event) => updateField('workloadHours', event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Docente<select required value={form.instructorId} onChange={(event) => updateField('instructorId', event.target.value)} style={inputStyle}><option value="">Selecione o docente</option>{teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.email})</option>)}</select></label>
          <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>Descrição<textarea rows={3} value={form.description} onChange={(event) => updateField('description', event.target.value)} style={{ ...inputStyle, resize: 'vertical' }} /></label>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: density.sectionGap, display: 'grid', gridTemplateColumns: '1fr 180px', gap: density.sectionGap }}>
          <label style={labelStyle}>Primeira turma<input required value={form.className} onChange={(event) => updateField('className', event.target.value)} placeholder="Turma Agosto 2026" style={inputStyle} /></label>
          <label style={labelStyle}>Limite de vagas<input required type="number" min="1" value={form.capacity} onChange={(event) => updateField('capacity', event.target.value)} style={inputStyle} /></label>
        </div>
        <div><button type="submit" disabled={saving} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.lg}`, background: palette.brand.primary, color: '#fff', fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Salvar curso'}</button></div>
      </form>}

      <section className="admin-course-list" style={{ ...panelStyle, overflow: 'hidden' }}>
        <div style={{ padding: density.panelPadding, display: 'flex', gap: spacing.sm, flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)' }}>
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void loadCourses(); }} placeholder="Buscar por título ou slug" style={{ ...inputStyle, flex: 1, minWidth: 240 }} />
          <select value={status} onChange={(event) => setStatus(event.target.value)} style={{ ...inputStyle, width: 180 }}><option value="">Todos os status</option><option value="DRAFT">Rascunhos</option><option value="PUBLISHED">Publicados</option><option value="ARCHIVED">Arquivados</option></select>
          <button type="button" onClick={() => void loadCourses()} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, background: 'transparent', color: palette.brand.primary, padding: `${spacing.sm} ${spacing.md}`, fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>Buscar</button>
        </div>
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}><thead><tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>{['Curso', 'Turmas', 'Carga horária', 'Status', 'Ações'].map((heading) => <th key={heading} style={{ textAlign: heading === 'Ações' ? 'right' : 'left', padding: `${spacing.sm} ${spacing.md}`, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{heading}</th>)}</tr></thead><tbody>{courses.map((course) => <tr key={course.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: spacing.md, fontSize: typography.size.sm }}><strong style={{ fontWeight: typography.weight.semibold }}>{course.title}</strong><div style={{ marginTop: spacing.xs, color: 'var(--text-muted)', fontSize: typography.size.xs }}>{course.slug}</div></td><td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{course.classes.length} · {course.classes.reduce((total, item) => total + item.capacity, 0)} vagas</td><td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{course.workloadHours ? `${course.workloadHours}h` : 'Não informado'}</td><td style={{ padding: spacing.md, color: course.status === 'PUBLISHED' ? '#149e61' : 'var(--text-secondary)', fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}>{course.status === 'DRAFT' ? 'Rascunho' : course.status === 'PUBLISHED' ? 'Publicado' : 'Arquivado'}</td><td style={{ padding: spacing.md, textAlign: 'right', whiteSpace: 'nowrap' }}><button type="button" onClick={() => openEdit(course)} style={{ border: `1px solid var(--border-subtle)`, borderRadius: radius.sm, background: 'transparent', color: palette.brand.primary, padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Editar</button>{course.status === 'DRAFT' && <button type="button" onClick={() => void publishCourse(course)} style={{ border: 0, background: 'transparent', color: palette.brand.primary, padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Publicar</button>}{course.status !== 'ARCHIVED' && <button type="button" onClick={() => void archiveCourse(course)} style={{ border: 0, background: 'transparent', color: '#c6364d', padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Arquivar</button>}<button type="button" onClick={() => void deleteCourse(course)} style={{ border: 0, background: 'transparent', color: '#c6364d', padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Excluir</button></td></tr>)}</tbody></table>{!loading && courses.length === 0 && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Nenhum curso encontrado.</p>}{loading && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Carregando cursos...</p>}</div>
      </section>
    </AdminMainLayout>
  );
};

export default AdminCoursesEnterprisePage;
