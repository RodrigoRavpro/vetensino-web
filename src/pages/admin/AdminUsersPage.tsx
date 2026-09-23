import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../../services/api';
import { AdminMainLayout } from '../../components/admin/AdminMainLayout';
import { radius, spacing, typography } from '../../styles/designSystem';

type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
type AdminUser = { id: string; name: string; email: string; role: Role; phone: string | null; isActive: boolean; lastLoginAt: string | null };
type UserForm = { name: string; email: string; password: string; role: Role; phone: string };

const initialForm: UserForm = { name: '', email: '', password: '', role: 'STUDENT', phone: '' };
const roleLabels: Record<Role, string> = { STUDENT: 'Aluno', TEACHER: 'Docente', ADMIN: 'Admin' };

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<UserForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ users: AdminUser[] }>('/admin/users', { params: { search: search || undefined, role: role || undefined, limit: 100 } });
      setUsers(response.data.users);
    } catch {
      setMessage('Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadUsers(); }, [role]);

  const updateField = (field: keyof UserForm, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const saveUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = { ...form, phone: form.phone || null, ...(editingId && !form.password ? { password: undefined } : {}) };
      if (editingId) await api.patch(`/admin/users/${editingId}`, payload);
      else await api.post('/admin/users', payload);
      setForm(initialForm);
      setEditingId(null);
      setMessage(editingId ? 'Usuário atualizado.' : 'Usuário criado.');
      await loadUsers();
    } catch {
      setMessage('Não foi possível salvar. Verifique os dados e a sessão.');
    } finally {
      setSaving(false);
    }
  };

  const editUser = (user: AdminUser) => setForm({ name: user.name, email: user.email, password: '', role: user.role, phone: user.phone ?? '' });

  const deactivateUser = async (user: AdminUser) => {
    if (!window.confirm(`Desativar ${user.name}?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      setMessage('Usuário desativado.');
      await loadUsers();
    } catch {
      setMessage('Não foi possível desativar o usuário.');
    }
  };

  return (
    <AdminMainLayout breadcrumb={[{ label: 'Usuários' }]}>
        <header>
          <span style={{ color: 'var(--brand-light)', fontSize: typography.size.sm, fontWeight: 700 }}>ADMINISTRAÇÃO</span>
          <h1 style={{ margin: `${spacing.xs} 0 0`, fontSize: 'clamp(2rem, 4vw, 3.4rem)', letterSpacing: '-0.05em' }}>Usuários</h1>
          <p style={{ margin: `${spacing.sm} 0 0`, color: 'var(--text-secondary)' }}>Gerencie alunos, docentes e administradores sem expor credenciais.</p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.75fr) minmax(0, 1.25fr)', gap: spacing.xl, alignItems: 'start' }}>
          <form onSubmit={saveUser} style={{ display: 'grid', gap: spacing.md, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.lg, padding: spacing.xl }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md, alignItems: 'center' }}><h2 style={{ margin: 0, fontSize: '1.25rem' }}>{editingId ? 'Editar usuário' : 'Novo usuário'}</h2>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} style={{ border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancelar</button>}</div>
            <label style={{ display: 'grid', gap: spacing.xs }}>Nome<input required value={form.name} onChange={(event) => updateField('name', event.target.value)} /></label>
            <label style={{ display: 'grid', gap: spacing.xs }}>E-mail<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} /></label>
            <label style={{ display: 'grid', gap: spacing.xs }}>Senha{editingId && <small style={{ color: 'var(--text-muted)' }}>Deixe vazio para manter a senha atual.</small>}<input required={!editingId} type="password" minLength={8} value={form.password} onChange={(event) => updateField('password', event.target.value)} /></label>
            <label style={{ display: 'grid', gap: spacing.xs }}>Perfil<select value={form.role} onChange={(event) => updateField('role', event.target.value)}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label style={{ display: 'grid', gap: spacing.xs }}>Telefone<input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>
            {message && <p style={{ margin: 0, color: message.includes('Não') ? '#b42318' : '#2e9f8e' }}>{message}</p>}
            <button type="submit" disabled={saving} style={{ border: 0, borderRadius: radius.pill, padding: `${spacing.md} ${spacing.lg}`, background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-light))', color: 'var(--text-on-brand)', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar usuário'}</button>
          </form>

          <section style={{ display: 'grid', gap: spacing.md }}>
            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void loadUsers(); }} placeholder="Buscar por nome ou e-mail" style={{ flex: 1, minWidth: 220 }} /><select value={role} onChange={(event) => setRole(event.target.value)}><option value="">Todos os perfis</option>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button type="button" onClick={() => void loadUsers()} style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', borderRadius: radius.pill, padding: '9px 14px', cursor: 'pointer' }}>Buscar</button></div>
            {loading && <p style={{ color: 'var(--text-secondary)' }}>Carregando...</p>}
            {!loading && users.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Nenhum usuário encontrado.</p>}
            {!loading && users.length > 0 && <div style={{ overflowX: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.lg }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}><thead><tr><th style={{ textAlign: 'left', padding: spacing.md }}>Usuário</th><th style={{ textAlign: 'left', padding: spacing.md }}>Perfil</th><th style={{ textAlign: 'left', padding: spacing.md }}>Status</th><th style={{ textAlign: 'right', padding: spacing.md }}>Ações</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} style={{ borderTop: '1px solid var(--border-subtle)' }}><td style={{ padding: spacing.md }}><strong>{user.name}</strong><div style={{ color: 'var(--text-muted)', fontSize: typography.size.sm }}>{user.email}</div></td><td style={{ padding: spacing.md }}>{roleLabels[user.role]}</td><td style={{ padding: spacing.md, color: user.isActive ? '#2e9f8e' : 'var(--text-muted)' }}>{user.isActive ? 'Ativo' : 'Inativo'}</td><td style={{ padding: spacing.md, textAlign: 'right', whiteSpace: 'nowrap' }}><button type="button" onClick={() => { setEditingId(user.id); editUser(user); }} style={{ border: 0, background: 'transparent', color: 'var(--brand-light)', cursor: 'pointer', marginRight: 10 }}>Editar</button>{user.isActive && <button type="button" onClick={() => void deactivateUser(user)} style={{ border: 0, background: 'transparent', color: '#b42318', cursor: 'pointer' }}>Desativar</button>}</td></tr>)}</tbody></table></div>}
          </section>
        </section>
    </AdminMainLayout>
  );
};

export default AdminUsersPage;
