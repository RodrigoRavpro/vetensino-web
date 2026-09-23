import { useEffect, useState, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { spacing, radius, typography } from '../styles/designSystem';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import ReCAPTCHA from 'react-google-recaptcha';

const CaptchaWidget = ReCAPTCHA as unknown as ComponentType<{
  sitekey: string;
  onChange: (token: string | null) => void;
  onExpired: () => void;
}>;

const benefits = [
  'Acesso ao seu painel de estudos',
  'Material e certificados em um só lugar',
  'Compra e acompanhamento do curso em poucos cliques',
];

type LocalDevUser = {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
};

const roleLabels: Record<LocalDevUser['role'], string> = {
  ADMIN: 'Admin',
  TEACHER: 'Docente',
  STUDENT: 'Aluno',
};

const roleAccents: Record<LocalDevUser['role'], string> = {
  ADMIN: '#5d3eaa',
  TEACHER: '#c7911b',
  STUDENT: '#2e9f8e',
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login: authenticateUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [localDevUsers, setLocalDevUsers] = useState<LocalDevUser[]>([]);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const selectLocalDevUser = (user: LocalDevUser) => {
    if (!import.meta.env.DEV) return;
    setEmail(user.email);
    setPassword('PurpleVet@Dev2026');
    setMessage('Credenciais locais preenchidas. Clique em Entrar.');
  };

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    void api.get<{ users: LocalDevUser[] }>('/auth/dev-users')
      .then((response) => setLocalDevUsers(response.data.users))
      .catch(() => setLocalDevUsers([]));
  }, []);

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    try {
      const user = await authenticateUser(email, password, recaptchaToken || undefined);
      navigate(user.role === 'ADMIN' ? '/admin/cursos' : user.role === 'TEACHER' ? '/instructor/cursos' : '/meus-cursos');
    } catch (error: any) {
      const nextFailedAttempts = failedAttempts + 1;
      setFailedAttempts(nextFailedAttempts);
      if (error?.response?.data?.details?.captchaRequired || nextFailedAttempts >= 3) {
        setCaptchaRequired(true);
      }
      setMessage('Não foi possível entrar. Confira o e-mail e a senha.');
    }
  };

  return <main
    className="login-page"
    style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7f2e8 0%, #f5f6f8 100%)',
      color: 'var(--text-primary)',
      display: 'grid',
      placeItems: 'center',
      padding: '32px 20px',
    }}
  >
    <div
      className="login-card"
      style={{
        width: '100%',
        maxWidth: '1180px',
        display: 'grid',
        gridTemplateColumns: '0.9fr 1.1fr',
        gap: 0,
        background: '#ffffff',
        border: '1px solid rgba(34, 26, 52, 0.06)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 24px 56px rgba(35, 22, 61, 0.08)',
      }}
    >
      <section
        className="login-intro"
        style={{
          position: 'relative',
          padding: '42px 36px',
          background: 'linear-gradient(180deg, #f9f5ef 0%, #f5f0ff 100%)',
          display: 'grid',
          alignContent: 'center',
            gap: spacing.md,
            borderRight: '1px solid rgba(34, 26, 52, 0.05)',
        }}
      >
        <BrandLogo size="sm" compact />

          <div style={{ display: 'grid', gap: spacing.sm, maxWidth: '420px' }}>
          <h1
            style={{
              margin: 0,
                fontSize: 'clamp(2rem, 3vw, 3.2rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.06em',
              color: '#20162f',
            }}
          >
              Acesse sua conta
          </h1>
          <p
            style={{
              margin: 0,
              color: 'rgba(32,22,47,0.8)',
                fontSize: '1rem',
                lineHeight: 1.6,
            }}
          >
              Continue seu aprendizado com acesso ao material, progresso e certificados em um só lugar.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
              gap: spacing.sm,
              marginTop: spacing.xs,
              maxWidth: '420px',
          }}
        >
          {benefits.map((benefit) => (
            <div
              key={benefit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                color: '#20162f',
                  background: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(32,22,47,0.06)',
                  borderRadius: radius.md,
                  padding: '10px 12px',
                  width: '100%',
              }}
            >
              <span
                style={{
                    width: 8,
                    height: 8,
                  borderRadius: '50%',
                  background: '#4bbe72',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
                <span style={{ fontSize: '0.92rem' }}>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="login-form-panel"
        style={{
            padding: '40px 38px',
          display: 'grid',
          alignContent: 'center',
          gap: spacing.lg,
            background: '#fff',
        }}
      >
        <div style={{ display: 'grid', gap: spacing.xs }}>
          <span style={{ color: 'var(--text-muted)', fontSize: typography.size.sm }}>Bem-vindo(a) de volta</span>
          <h2 className="login-form-title" style={{ margin: 0, fontSize: '2rem', color: '#20162f', letterSpacing: '-0.04em' }}>Entrar na plataforma</h2>
        </div>

        {import.meta.env.DEV && localDevUsers.length > 0 && (
          <div
            style={{
              display: 'grid',
              gap: spacing.sm,
              padding: '10px 12px',
              borderRadius: radius.md,
              background: '#f7f5fb',
              border: '1px solid rgba(93, 62, 170, 0.08)',
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Usuários locais
            </span>
            <div style={{ display: 'grid', gap: spacing.xs }}>
              {localDevUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => selectLocalDevUser(user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: spacing.sm,
                    border: '1px solid rgba(32,22,47,0.08)',
                    borderLeft: `4px solid ${roleAccents[user.role]}`,
                    borderRadius: radius.sm,
                    background: '#fff',
                    color: '#20162f',
                    padding: '9px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <strong>{roleLabels[user.role]}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: typography.size.sm }}>{user.email}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {captchaRequired && recaptchaSiteKey && (
          <CaptchaWidget sitekey={recaptchaSiteKey} onChange={setRecaptchaToken} onExpired={() => setRecaptchaToken(null)} />
        )}

        <form
          onSubmit={login}
          style={{
            display: 'grid',
            gap: spacing.lg,
          }}
        >
          <label style={{ display: 'grid', gap: spacing.sm, color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600 }}>E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              style={{
                width: '100%',
                border: '1px solid rgba(32,22,47,0.14)',
                borderRadius: radius.md,
                background: '#fff',
                color: 'var(--text-primary)',
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.size.md,
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: spacing.sm, color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600 }}>Senha</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                border: '1px solid rgba(32,22,47,0.14)',
                borderRadius: radius.md,
                background: '#fff',
                color: 'var(--text-primary)',
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.size.md,
                outline: 'none',
              }}
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: 'var(--text-secondary)' }}>
              <input type="checkbox" />
              Lembrar de mim
            </label>
            <a href="/" style={{ color: '#5d3eaa', textDecoration: 'none', fontWeight: 600 }}>
              Esqueci a senha
            </a>
          </div>

          <button
            type="submit"
            style={{
              border: 'none',
              background: 'linear-gradient(135deg, #5d3eaa, #7d5ad0)',
              color: '#fff',
              borderRadius: radius.pill,
              padding: '14px 18px',
              fontWeight: typography.weight.bold,
              cursor: 'pointer',
              fontSize: typography.size.md,
              boxShadow: '0 12px 22px rgba(93, 62, 170, 0.14)',
            }}
          >
            Entrar
          </button>
        </form>

        {message && <p style={{ margin: 0, color: message.includes('preenchidas') ? '#2e9f8e' : '#b42318', fontSize: typography.size.sm }}>{message}</p>}

        <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          Ainda não tem conta?{' '}
          <a href="/" style={{ color: '#5d3eaa', textDecoration: 'none', fontWeight: 700 }}>
            Cadastre-se
          </a>
        </div>
      </section>
    </div>
  </main>;
};

export default LoginPage;
