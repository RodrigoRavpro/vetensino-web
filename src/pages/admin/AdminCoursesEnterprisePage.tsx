import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AdminMainLayout } from '../../components/admin/AdminMainLayout';
import { density, palette, radius, spacing, typography } from '../../styles/designSystem';

type CourseClass = { id: string; name: string; capacity: number; status: string };
type Instructor = { id: string; name: string; email: string } | null;
type Enrollment = { id: string; status: string; progressPercent: number; user: { id: string; name: string; email: string }; class: { id: string; name: string } | null };
type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: string;
  status: string;
  workloadHours: number | null;
  instructor: Instructor;
  classes: CourseClass[];
  enrollmentsCount: number;
  enrollments?: Enrollment[];
};
type Teacher = { id: string; name: string; email: string };

const panelStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.md, boxShadow: '0 1px 4px rgba(16, 24, 40, 0.04)' };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, minHeight: density.controlHeight, padding: density.controlPadding, border: '1px solid var(--border-strong)', borderRadius: radius.sm, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, outline: 'none' };

export const AdminCoursesEnterprisePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [reassigningId, setReassigningId] = useState<string | null>(null);
  const [studentsCourse, setStudentsCourse] = useState<Course | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ courses: Course[] }>('/admin/courses');
      const result = response.data.courses
        .filter((course) => !status || course.status === status)
        .filter((course) => !search || `${course.title} ${course.slug}`.toLowerCase().includes(search.toLowerCase()));
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

  const publishCourse = async (course: Course) => {
    if (!window.confirm(`Publicar o curso "${course.title}"?`)) return;
    try { await api.post(`/admin/courses/${course.id}/publish`); setMessage('Curso publicado com sucesso.'); await loadCourses(); }
    catch { setMessage('Não foi possível publicar o curso.'); }
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

  const reassignInstructor = async (course: Course, instructorId: string) => {
    if (!instructorId) return;
    try {
      await api.patch(`/admin/courses/${course.id}`, { instructorId });
      setMessage('Docente reatribuído com sucesso.');
      setReassigningId(null);
      await loadCourses();
    } catch {
      setMessage('Não foi possível reatribuir o docente.');
    }
  };

  const openStudents = async (course: Course) => {
    setLoadingStudents(true);
    try {
      const response = await api.get<{ course: Course }>(`/admin/courses/${course.id}`);
      setStudentsCourse(response.data.course);
    } catch {
      setMessage('Não foi possível carregar os alunos deste curso.');
    } finally {
      setLoadingStudents(false);
    }
  };

  if (studentsCourse) {
    return (
      <AdminMainLayout breadcrumb={[{ label: 'Cursos', to: '/admin/cursos' }, { label: studentsCourse.title }]}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.xl, fontWeight: typography.weight.semibold }}>Alunos · {studentsCourse.title}</h1>
          <button type="button" onClick={() => setStudentsCourse(null)} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: 'transparent', color: palette.brand.primary, fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>Voltar aos cursos</button>
        </header>
        <section style={{ ...panelStyle, overflow: 'hidden' }}>
          {loadingStudents && <p style={{ margin: 0, padding: spacing.xl, textAlign: 'center', color: 'var(--text-secondary)', fontSize: typography.size.sm }}>Carregando...</p>}
          {!loadingStudents && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                  {['Aluno', 'Turma', 'Progresso', 'Status'].map((heading) => (
                    <th key={heading} style={{ textAlign: 'left', padding: `${spacing.sm} ${spacing.md}`, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, textTransform: 'uppercase' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(studentsCourse.enrollments ?? []).map((enrollment) => (
                  <tr key={enrollment.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: spacing.md, fontSize: typography.size.sm }}>
                      <strong>{enrollment.user.name}</strong>
                      <div style={{ marginTop: spacing.xs, color: 'var(--text-muted)', fontSize: typography.size.xs }}>{enrollment.user.email}</div>
                    </td>
                    <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{enrollment.class?.name ?? '—'}</td>
                    <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{enrollment.progressPercent}%</td>
                    <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{enrollment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loadingStudents && (studentsCourse.enrollments ?? []).length === 0 && <p style={{ margin: 0, padding: spacing.xl, textAlign: 'center', color: 'var(--text-secondary)', fontSize: typography.size.sm }}>Nenhum aluno inscrito ainda.</p>}
        </section>
      </AdminMainLayout>
    );
  }

  return (
    <AdminMainLayout breadcrumb={[{ label: 'Cursos' }]}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: spacing.xs }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.xl, lineHeight: 1.2, fontWeight: typography.weight.semibold }}>Cursos</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, lineHeight: 1.4 }}>
            Visão geral dos cursos criados pelos docentes. A edição de conteúdo é responsabilidade de cada docente no próprio painel.
          </p>
        </div>
      </header>

      {message && <div role="status" style={{ ...panelStyle, padding: `${spacing.sm} ${spacing.md}`, color: message.includes('Não') ? '#b42318' : '#149e61', fontSize: typography.size.sm }}>{message}</div>}

      <section className="admin-course-list" style={{ ...panelStyle, overflow: 'hidden' }}>
        <div style={{ padding: density.panelPadding, display: 'flex', gap: spacing.sm, flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)' }}>
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void loadCourses(); }} placeholder="Buscar por título ou slug" style={{ ...inputStyle, flex: 1, minWidth: 240 }} />
          <select value={status} onChange={(event) => setStatus(event.target.value)} style={{ ...inputStyle, width: 180 }}><option value="">Todos os status</option><option value="DRAFT">Rascunhos</option><option value="PUBLISHED">Publicados</option><option value="ARCHIVED">Arquivados</option></select>
          <button type="button" onClick={() => void loadCourses()} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, background: 'transparent', color: palette.brand.primary, padding: `${spacing.sm} ${spacing.md}`, fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>Buscar</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                {['Curso', 'Docente', 'Turmas', 'Inscritos', 'Status', 'Ações'].map((heading) => (
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
                    {course.status === 'PUBLISHED' && <a href={`/cursos/${course.slug}`} target="_blank" rel="noreferrer" style={{ color: palette.brand.primary, fontSize: typography.size.xs, textDecoration: 'none' }}>Acessar página pública ↗</a>}
                  </td>
                  <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>
                    {reassigningId === course.id ? (
                      <select autoFocus defaultValue="" onChange={(event) => void reassignInstructor(course, event.target.value)} onBlur={() => setReassigningId(null)} style={inputStyle}>
                        <option value="">Selecione o docente</option>
                        {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
                      </select>
                    ) : (
                      <>
                        {course.instructor ? course.instructor.name : <em style={{ color: '#b42318' }}>Sem docente</em>}
                        <button type="button" onClick={() => setReassigningId(course.id)} style={{ marginLeft: spacing.xs, border: 0, background: 'transparent', color: palette.brand.primary, fontSize: typography.size.xs, cursor: 'pointer' }}>reatribuir</button>
                      </>
                    )}
                  </td>
                  <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{course.classes.length} · {course.classes.reduce((total, item) => total + item.capacity, 0)} vagas</td>
                  <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{course.enrollmentsCount}</td>
                  <td style={{ padding: spacing.md, color: course.status === 'PUBLISHED' ? '#149e61' : 'var(--text-secondary)', fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}>{course.status === 'DRAFT' ? 'Rascunho' : course.status === 'PUBLISHED' ? 'Publicado' : 'Arquivado'}</td>
                  <td style={{ padding: spacing.md, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button type="button" onClick={() => void openStudents(course)} style={{ border: `1px solid var(--border-subtle)`, borderRadius: radius.sm, background: 'transparent', color: palette.brand.primary, padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Ver alunos</button>
                    {course.status === 'DRAFT' && <button type="button" onClick={() => void publishCourse(course)} style={{ border: 0, background: 'transparent', color: palette.brand.primary, padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Publicar</button>}
                    {course.status !== 'ARCHIVED' && <button type="button" onClick={() => void archiveCourse(course)} style={{ border: 0, background: 'transparent', color: '#c6364d', padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Arquivar</button>}
                    <button type="button" onClick={() => void deleteCourse(course)} style={{ border: 0, background: 'transparent', color: '#c6364d', padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && courses.length === 0 && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Nenhum curso encontrado.</p>}
          {loading && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Carregando cursos...</p>}
        </div>
      </section>
    </AdminMainLayout>
  );
};

export default AdminCoursesEnterprisePage;
