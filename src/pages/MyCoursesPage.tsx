import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { density, palette, radius, spacing, typography } from '../styles/designSystem';

type Student = { id: string; name: string; email: string; enrollmentStatus: string };
type CourseClass = { id: string; name: string; startsAt: string | null; endsAt: string | null; enrollment?: { id: string; status: string; startedAt: string | null; completedAt: string | null } | null };
type Course = { id: string; slug: string; title: string; subtitle: string | null; coverImageUrl: string | null; students?: Student[]; enrollment?: { id: string; status: string; startedAt: string | null; completedAt: string | null } | null; classes: CourseClass[] };

const panelStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.md, boxShadow: '0 1px 4px rgba(16, 24, 40, 0.04)' };
const enrollmentLabels: Record<string, string> = { ACTIVE: 'Matrícula ativa', COMPLETED: 'Concluído', SUSPENDED: 'Matrícula suspensa', EXPIRED: 'Acesso expirado' };

export const MyCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isTeacher = user?.role === 'TEACHER';

  useEffect(() => {
    void api.get<{ courses: Course[] }>('/courses/mine')
      .then((response) => setCourses(response.data.courses))
      .catch(() => setError('Não foi possível carregar seus cursos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', padding: `${spacing.xl} ${spacing.md}` }}>
      <div style={{ width: 'min(100%, 1120px)', margin: '0 auto', display: 'grid', gap: spacing.lg }}>
        <header style={{ display: 'grid', gap: spacing.xs }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: typography.fontFamily, fontSize: typography.size.xs, fontWeight: typography.weight.semibold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isTeacher ? 'Área do docente' : 'Área do aluno'}</span>
          <h1 style={{ margin: 0, fontFamily: typography.fontFamily, fontSize: typography.size.xl, fontWeight: typography.weight.semibold }}>{isTeacher ? 'Meus cursos e alunos' : 'Meus cursos'}</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm }}>{isTeacher ? 'Acompanhe os cursos sob sua responsabilidade e os alunos matriculados.' : 'Acesse todos os cursos em que você está matriculado.'}</p>
        </header>

        {loading && <p style={{ color: 'var(--text-secondary)' }}>Carregando cursos...</p>}
        {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
        {!loading && !error && courses.length === 0 && <section style={{ ...panelStyle, padding: density.panelPadding, color: 'var(--text-secondary)' }}>{isTeacher ? 'Nenhum curso está vinculado a este docente.' : 'Você ainda não possui cursos matriculados.'}</section>}

        {courses.map((course) => (
          <article key={course.id} style={{ ...panelStyle, overflow: 'hidden', display: 'grid' }}>
            {course.coverImageUrl && <img src={course.coverImageUrl} alt="" style={{ width: '100%', height: 220, objectFit: 'cover' }} />}
            <div style={{ padding: density.panelPadding, display: 'grid', gap: spacing.md }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md, alignItems: 'start', flexWrap: 'wrap' }}>
                <div><h2 style={{ margin: 0, fontFamily: typography.fontFamily, fontSize: typography.size.lg }}>{course.title}</h2>{course.subtitle && <p style={{ margin: `${spacing.xs} 0 0`, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{course.subtitle}</p>}</div>
                <Link to={`/cursos/${course.slug}`} style={{ color: palette.brand.primary, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, textDecoration: 'none' }}>Ver curso</Link>
              </div>
              {isTeacher && <div style={{ display: 'grid', gap: spacing.xs }}><span style={{ color: 'var(--text-secondary)', fontSize: typography.size.xs }}>{course.students?.length ?? 0} aluno(s) matriculado(s)</span>{(course.students?.length ?? 0) > 0 && <ul style={{ margin: 0, paddingLeft: spacing.lg, display: 'grid', gap: spacing.xs }}>{course.students?.map((student) => <li key={student.id} style={{ color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{student.name} <span style={{ color: 'var(--text-muted)' }}>({student.email})</span></li>)}</ul>}</div>}
              {!isTeacher && <span style={{ color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{course.enrollment ? enrollmentLabels[course.enrollment.status] ?? course.enrollment.status : 'Matrícula não encontrada'}</span>}
              {course.classes.map((courseClass) => (
                <section key={courseClass.id} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: spacing.md, display: 'grid', gap: spacing.sm }}>
                  <strong style={{ fontSize: typography.size.sm }}>{courseClass.name}</strong>
                  {!isTeacher && courseClass.enrollment && <span style={{ color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{enrollmentLabels[courseClass.enrollment.status] ?? courseClass.enrollment.status}</span>}
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};