import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../../services/api';
import { AdminMainLayout } from '../../components/admin/AdminMainLayout';
import { density, palette, radius, spacing, typography } from '../../styles/designSystem';

type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
type AdminUser = { id: string; name: string; email: string; role: Role; phone: string | null; isActive: boolean; lastLoginAt: string | null };
type UserForm = { name: string; email: string; password: string; role: Role; phone: string };

const initialForm: UserForm = { name: '', email: '', password: '', role: 'STUDENT', phone: '' };
const roleLabels: Record<Role, string> = { STUDENT: 'Aluno', TEACHER: 'Docente', ADMIN: 'Administrador' };
const panelStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.md, boxShadow: '0 1px 4px rgba(16, 24, 40, 0.04)' };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, minHeight: density.controlHeight, padding: density.controlPadding, border: '1px solid var(--border-strong)', borderRadius: radius.sm, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, outline: 'none' };
const labelStyle = { display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold };

export const AdminUsersEnterprisePage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<UserForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
  const openCreate = () => { setEditingId(null); setForm(initialForm); setMessage(''); setShowForm(true); };
  const openEdit = (user: AdminUser) => { setEditingId(user.id); setForm({ name: user.name, email: user.email, password: '', role: user.role, phone: user.phone ?? '' }); setMessage(''); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(initialForm); };

  const saveUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = { ...form, phone: form.phone || null, ...(editingId && !form.password ? { password: undefined } : {}) };
      if (editingId) await api.patch(`/admin/users/${editingId}`, payload);
      else await api.post('/admin/users', payload);
      closeForm();
      setMessage(editingId ? 'Usuário atualizado com sucesso.' : 'Usuário criado com sucesso.');
      await loadUsers();
    } catch {
      setMessage('Não foi possível salvar. Verifique os dados informados.');
    } finally {
      setSaving(false);
    }
  };

  const deactivateUser = async (user: AdminUser) => {
    if (!window.confirm(`Desativar ${user.name}?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      setMessage('Usuário desativado com sucesso.');
      await loadUsers();
    } catch {
      setMessage('Não foi possível desativar o usuário.');
    }
  };

  return (
    <AdminMainLayout breadcrumb={[{ label: 'Usuários' }]}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: spacing.xs }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.xl, lineHeight: 1.2, fontWeight: typography.weight.semibold }}>Usuários</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm, lineHeight: 1.4 }}>Gerencie alunos, docentes e administradores.</p>
        </div>
        <button type="button" onClick={openCreate} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: palette.brand.primary, color: '#fff', fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>+ Novo usuário</button>
      </header>

      {message && <div role="status" style={{ ...panelStyle, padding: `${spacing.sm} ${spacing.md}`, color: message.includes('Não') ? '#b42318' : '#149e61', fontSize: typography.size.sm }}>{message}</div>}

      {showForm && <form onSubmit={saveUser} style={{ ...panelStyle, padding: density.panelPadding, display: 'grid', gap: density.sectionGap }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }}><h2 style={{ margin: 0, fontFamily: typography.fontFamily, fontSize: typography.size.md, lineHeight: 1.4, fontWeight: typography.weight.semibold }}>{editingId ? 'Editar usuário' : 'Novo usuário'}</h2><button type="button" onClick={closeForm} style={{ border: 0, background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: typography.fontFamily }}>Cancelar</button></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: density.sectionGap }}>
          <label style={labelStyle}>Nome<input required value={form.name} onChange={(event) => updateField('name', event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>E-mail<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Senha<input required={!editingId} type="password" minLength={8} value={form.password} onChange={(event) => updateField('password', event.target.value)} style={inputStyle} />{editingId && <small style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Vazio mantém a senha atual.</small>}</label>
          <label style={labelStyle}>Perfil<select value={form.role} onChange={(event) => updateField('role', event.target.value)} style={inputStyle}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label style={labelStyle}>Telefone<input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} style={inputStyle} /></label>
        </div>
        <div><button type="submit" disabled={saving} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.lg}`, background: palette.brand.primary, color: '#fff', fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Salvando...' : 'Salvar usuário'}</button></div>
      </form>}

      <section style={{ ...panelStyle, overflow: 'hidden' }}>
        <div style={{ padding: density.panelPadding, display: 'flex', gap: spacing.sm, flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)' }}>
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void loadUsers(); }} placeholder="Buscar por nome ou e-mail" style={{ ...inputStyle, flex: 1, minWidth: 240 }} />
          <select value={role} onChange={(event) => setRole(event.target.value)} style={{ ...inputStyle, width: 190 }}><option value="">Todos os perfis</option>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <button type="button" onClick={() => void loadUsers()} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, background: 'transparent', color: palette.brand.primary, padding: `${spacing.sm} ${spacing.md}`, fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>Buscar</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
            <thead><tr style={{ borderBottom: `2px solid var(--border-subtle)` }}>{['Usuário', 'Perfil', 'Último acesso', 'Status', 'Ações'].map((heading) => <th key={heading} style={{ textAlign: heading === 'Ações' ? 'right' : 'left', padding: `${spacing.sm} ${spacing.md}`, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{heading}</th>)}</tr></thead>
            <tbody>
              {users.map((user) => <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: `${spacing.md} ${spacing.md}`, color: 'var(--text-primary)', fontSize: typography.size.sm }}><strong style={{ fontWeight: typography.weight.semibold }}>{user.name}</strong><div style={{ marginTop: spacing.xs, color: 'var(--text-muted)', fontSize: typography.size.xs }}>{user.email}</div></td><td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{roleLabels[user.role]}</td><td style={{ padding: spacing.md, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('pt-BR') : 'Nunca'}</td><td style={{ padding: spacing.md, fontSize: typography.size.sm }}><span style={{ color: user.isActive ? '#149e61' : 'var(--text-muted)', fontWeight: typography.weight.semibold }}>{user.isActive ? 'Ativo' : 'Inativo'}</span></td><td style={{ padding: spacing.md, textAlign: 'right', whiteSpace: 'nowrap' }}><button type="button" onClick={() => openEdit(user)} style={{ border: `1px solid var(--border-subtle)`, borderRadius: radius.sm, background: 'transparent', color: palette.brand.primary, padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Editar</button>{user.isActive && <button type="button" onClick={() => void deactivateUser(user)} style={{ border: 0, background: 'transparent', color: '#c6364d', padding: `${spacing.xs} ${spacing.sm}`, fontFamily: typography.fontFamily, fontSize: typography.size.xs, cursor: 'pointer' }}>Desativar</button>}</td></tr>)}
            </tbody>
          </table>
          {!loading && users.length === 0 && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Nenhum usuário encontrado.</p>}
          {loading && <p style={{ margin: 0, padding: spacing.xl, color: 'var(--text-secondary)', textAlign: 'center', fontSize: typography.size.sm }}>Carregando usuários...</p>}
        </div>
      </section>
    </AdminMainLayout>
  );
};

export default AdminUsersEnterprisePage;
