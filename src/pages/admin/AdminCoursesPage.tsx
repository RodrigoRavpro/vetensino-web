import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AdminMainLayout } from '../../components/admin/AdminMainLayout';
import { radius, spacing, typography } from '../../styles/designSystem';

type Course = {
  id: string;
  title: string;
  slug: string;
  price: string;
  status: string;
  classes: Array<{ id: string; name: string; capacity: number; status: string }>;
};

const emptyCourse = {
  title: '',
  slug: '',
  description: '',
  price: '0',
  workloadHours: '',
  className: '',
  capacity: '20',
};

export const AdminCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState(emptyCourse);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ courses: Course[] }>('/admin/courses');
      setCourses(response.data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCourses();
  }, []);

  const updateField = (field: keyof typeof emptyCourse, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.post('/admin/courses', {
        slug: form.slug,
        title: form.title,
        description: form.description || null,
        price: Number(form.price),
        workloadHours: form.workloadHours ? Number(form.workloadHours) : null,
        classes: [
          {
            name: form.className,
            capacity: Number(form.capacity),
            format: 'ONLINE',
          },
        ],
      });
      setForm(emptyCourse);
      setMessage('Curso criado com sucesso.');
      await loadCourses();
    } catch {
      setMessage('Não foi possível criar o curso. Verifique os dados e sua sessão.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminMainLayout breadcrumb={[{ label: 'Cursos' }]}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.lg, alignItems: 'end', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: 'var(--brand-light)', fontSize: typography.size.sm, fontWeight: 700 }}>ADMINISTRAÇÃO</span>
            <h1 style={{ margin: `${spacing.xs} 0 0`, fontSize: 'clamp(2rem, 4vw, 3.4rem)', letterSpacing: '-0.05em' }}>Cursos e turmas</h1>
            <p style={{ margin: `${spacing.sm} 0 0`, color: 'var(--text-secondary)' }}>Cadastre a oferta, limite vagas e organize as próximas turmas.</p>
          </div>
          <button type="button" onClick={() => document.getElementById('novo-curso')?.scrollIntoView({ behavior: 'smooth' })} style={{ border: 0, borderRadius: radius.pill, padding: '11px 18px', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-light))', color: 'var(--text-on-brand)', fontWeight: 700, cursor: 'pointer' }}>+ Novo curso</button>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(280px, 0.9fr)', gap: spacing.xl, alignItems: 'start' }}>
          <form id="novo-curso" onSubmit={createCourse} style={{ display: 'grid', gap: spacing.md, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.lg, padding: spacing.xl }}>
            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Novo curso</h2>
            <label style={{ display: 'grid', gap: spacing.xs }}>Título<input required value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Ex.: Medicina Veterinária" /></label>
            <label style={{ display: 'grid', gap: spacing.xs }}>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder="medicina-veterinaria" /></label>
            <label style={{ display: 'grid', gap: spacing.xs }}>Descrição<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={4} /></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
              <label style={{ display: 'grid', gap: spacing.xs }}>Preço<input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} /></label>
              <label style={{ display: 'grid', gap: spacing.xs }}>Carga horária<input type="number" min="1" value={form.workloadHours} onChange={(event) => updateField('workloadHours', event.target.value)} /></label>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: spacing.md, display: 'grid', gap: spacing.md }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Primeira turma</h3>
              <label style={{ display: 'grid', gap: spacing.xs }}>Nome da turma<input required value={form.className} onChange={(event) => updateField('className', event.target.value)} placeholder="Turma Agosto 2026" /></label>
              <label style={{ display: 'grid', gap: spacing.xs }}>Limite de vagas<input required type="number" min="1" value={form.capacity} onChange={(event) => updateField('capacity', event.target.value)} /></label>
            </div>
            {message && <p style={{ margin: 0, color: message.includes('sucesso') ? '#2e9f8e' : '#b42318' }}>{message}</p>}
            <button type="submit" disabled={saving} style={{ border: 0, borderRadius: radius.pill, padding: `${spacing.md} ${spacing.lg}`, background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-light))', color: 'var(--text-on-brand)', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Salvando...' : 'Cadastrar curso'}</button>
          </form>

          <section style={{ display: 'grid', gap: spacing.md }}>
            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Cursos cadastrados</h2>
            {loading && <p style={{ color: 'var(--text-secondary)' }}>Carregando...</p>}
            {!loading && courses.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Nenhum curso cadastrado.</p>}
            {courses.map((course) => (
              <article key={course.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.lg, padding: spacing.lg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md }}><strong>{course.title}</strong><span style={{ color: 'var(--brand-light)', fontSize: typography.size.sm }}>{course.status}</span></div>
                <p style={{ margin: `${spacing.sm} 0`, color: 'var(--text-muted)', fontSize: typography.size.sm }}>{course.slug} · R$ {course.price}</p>
                {course.classes.map((courseClass) => <div key={courseClass.id} style={{ paddingTop: spacing.sm, borderTop: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{courseClass.name} · {courseClass.capacity} vagas · {courseClass.status}</div>)}
              </article>
            ))}
          </section>
        </section>
    </AdminMainLayout>
  );
};

export default AdminCoursesPage;
