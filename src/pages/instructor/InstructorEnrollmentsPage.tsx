import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { InstructorMainLayout } from '../../components/instructor/InstructorMainLayout';
import { density, palette, radius, spacing, typography } from '../../styles/designSystem';

type CourseOption = { id: string; title: string };
type Enrollment = {
  id: string;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'EXPIRED';
  progressPercent: number;
  startedAt: string | null;
  completedAt: string | null;
  user: { id: string; name: string; email: string };
  class: { id: string; name: string } | null;
};

const panelStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.md, boxShadow: '0 1px 4px rgba(16, 24, 40, 0.04)' };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, minHeight: density.controlHeight, padding: density.controlPadding, border: '1px solid var(--border-strong)', borderRadius: radius.sm, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, outline: 'none' };
const statusLabel: Record<Enrollment['status'], string> = { ACTIVE: 'Ativa', COMPLETED: 'Concluída', SUSPENDED: 'Suspensa', EXPIRED: 'Expirada' };
const pageSize = 20;

export const InstructorEnrollmentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const courseId = searchParams.get('courseId') ?? '';
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void api.get<{ courses: CourseOption[] }>('/instructor/courses').then((response) => {
      setCourses(response.data.courses);
      if (!courseId && response.data.courses[0]) setSearchParams({ courseId: response.data.courses[0].id });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEnrollments = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const response = await api.get<{ enrollments: Enrollment[]; total: number }>(`/instructor/courses/${courseId}/enrollments`, { params: { page, pageSize } });
      setEnrollments(response.data.enrollments);
      setTotal(response.data.total);
    } catch {
      setMessage('Não foi possível carregar as inscrições.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadEnrollments(); }, [courseId, page]);

  const changeStatus = async (enrollment: Enrollment, status: Enrollment['status']) => {
    if (!window.confirm(`Alterar status de "${enrollment.user.name}" para ${statusLabel[status]}?`)) return;
    try {
      await api.patch(`/instructor/courses/${courseId}/enrollments/${enrollment.id}`, { status });
      setMessage('Status atualizado com sucesso.');
      await loadEnrollments();
    } catch {
      setMessage('Não foi possível atualizar o status desta inscrição.');
    }
  };

  const exportCsv = async () => {
    if (!courseId) return;
    const response = await api.get(`/instructor/courses/${courseId}/enrollments/export`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inscricoes-${courseId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <InstructorMainLayout breadcrumb={[{ label: 'Inscrições' }]}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: spacing.xs }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.xl, lineHeight: 1.2, fontWeight: typography.weight.semibold }}>Inscrições</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm }}>Lista de alunos inscritos no curso selecionado.</p>
        </div>
        <button type="button" disabled={!courseId} onClick={() => void exportCsv()} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: 'transparent', color: palette.brand.primary, fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: courseId ? 'pointer' : 'not-allowed' }}>Exportar CSV</button>
      </header>

      <section style={{ ...panelStyle, padding: density.panelPadding, display: 'grid', gap: spacing.sm }}>
        <label style={{ display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold }}>
          Curso
          <select value={courseId} onChange={(event) => { setPage(1); setSearchParams({ courseId: event.target.value }); }} style={inputStyle}>
            <option value="">Selecione um curso</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
        </label>
      </section>

      {message && <div role="status" style={{ ...panelStyle, padding: `${spacing.sm} ${spacing.md}`, color: message.includes('Não') ? '#b42318' : '#149e61', fontSize: typography.size.sm }}>{message}</div>}

      <section style={{ ...panelStyle, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                {['Aluno', 'Turma', 'Progresso', 'Status', 'Ações'].map((heading) => (
                  <th key={heading} style={{ textAlign: heading === 'Ações' ? 'right' : 'left', padding: `${spacing.sm} ${spacing.md}`, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: spacing.md, fontSize: typography.size.sm }}>
                    <strong style={{ fontWeight: typography.weight.semibold }}>{enrollment.user.name}</strong>
                    <div style={{ marginTop: spacing.xs, color: 'var(--text-muted)', fontSize: typography.size.xs }}>{enrollment.user.email}</div>
                  </td>
                  <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{enrollment.class?.name ?? '—'}</td>
                  <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{enrollment.progressPercent}%</td>
                  <td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}>{statusLabel[enrollment.status]}</td>
                  <td style={{ padding: spacing.md, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {enrollment.status !== 'EXPIRED' && (
                      <select
                        value=""
                        onChange={(event) => { if (event.target.value) void changeStatus(enrollment, event.target.value as Enrollment['status']); }}
                        style={{ ...inputStyle, width: 'auto', display: 'inline-block' }}
                      >
                        <option value="">Alterar status...</option>
                        {(['ACTIVE', 'COMPLETED', 'SUSPENDED'] as const).filter((option) => option !== enrollment.status).map((option) => (
                          <option key={option} value={option}>{statusLabel[option]}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && enrollments.length === 0 && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Nenhuma inscrição encontrada.</p>}
          {loading && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Carregando inscrições...</p>}
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} style={{ border: `1px solid var(--border-subtle)`, borderRadius: radius.sm, background: 'transparent', padding: `${spacing.xs} ${spacing.sm}`, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>Anterior</button>
            <span style={{ fontSize: typography.size.sm, color: 'var(--text-secondary)' }}>{page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} style={{ border: `1px solid var(--border-subtle)`, borderRadius: radius.sm, background: 'transparent', padding: `${spacing.xs} ${spacing.sm}`, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>Próxima</button>
          </div>
        )}
      </section>
    </InstructorMainLayout>
  );
};

export default InstructorEnrollmentsPage;
