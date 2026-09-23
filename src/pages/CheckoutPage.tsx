import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { palette, radius, spacing, typography } from '../styles/designSystem';
import BrandLogo from '../components/BrandLogo';

type CheckoutState = { courseId: string; classId: string; courseTitle: string; className: string; total: string };

// Logo discreta (cinza) que ganha cor ao passar o mouse/focar.
const footerLogoStyle = '.course-footer-logo{filter:grayscale(1);opacity:0.5;transition:filter .2s ease,opacity .2s ease}.course-footer-logo:hover,.course-footer-logo:focus-visible{filter:none;opacity:1}';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { publicId } = useParams();
  const state = (location.state || {}) as Partial<CheckoutState>;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<{ status: string; paymentStatus: string | null; provider: string; checkoutUrl: string | null } | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!publicId) return;
    void api.get<{ order: { status: string; paymentStatus: string | null; provider: string; checkoutUrl: string | null } }>(`/checkout/orders/${publicId}`)
      .then(({ data }) => {
        setOrderStatus(data.order);
        if (data.order.provider !== 'FINPET' || !data.order.checkoutUrl || data.order.paymentStatus === 'APPROVED') return;
        const target = new URL(data.order.checkoutUrl, window.location.origin);
        if (target.origin === window.location.origin) return;
        setRedirecting(true);
        window.setTimeout(() => window.location.assign(target.toString()), 700);
      })
      .catch(() => setMessage('Não foi possível consultar o pedido.'));
  }, [publicId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Sem gateway de pagamento ativo no momento: a API cria o pedido como PENDING com método padrão.
      const response = await api.post<{ status: string; position?: number; checkout?: { checkoutUrl: string; publicId: string } }>('/checkout/orders', { courseId: state.courseId, classId: state.classId, name, email, cpf: cpf || undefined });
      if (response.data.status === 'WAITLISTED') {
        setWaitlistPosition(response.data.position ?? null);
        setMessage('A turma está lotada. Seu cadastro foi incluído na fila de espera.');
        return;
      }
      const checkout = response.data.checkout;
      if (checkout?.checkoutUrl) window.location.assign(checkout.checkoutUrl);
      else if (checkout?.publicId) navigate(`/checkout/${checkout.publicId}`);
    } catch {
      setMessage('Não foi possível iniciar o checkout. Verifique os dados ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!state.courseId || !state.classId) {
    if (publicId) {
      const isLocalProvider = (orderStatus?.provider ?? 'LOCAL') !== 'FINPET';
      const statusHeading = redirecting ? 'Redirecionando para o pagamento' : isLocalProvider ? 'Inscrição recebida' : 'Status do pagamento';
      // Sem gateway ativo, a confirmação é manual — evita mencionar FINPET/pagamento pendente sem propósito.
      const statusMessage = redirecting
        ? 'Você será encaminhado para o ambiente seguro do FINPET.'
        : orderStatus?.paymentStatus === 'APPROVED'
          ? 'Pagamento aprovado. Sua matrícula foi confirmada.'
          : isLocalProvider
            ? 'Inscrição recebida com sucesso! Nossa equipe entrará em contato para confirmar sua matrícula.'
            : 'Pagamento pendente. Aguarde a confirmação do FINPET.';
      return <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily }}><div style={{ flex: 1, display: 'grid', placeItems: 'center' }}><section style={{ maxWidth: 460, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.lg, padding: spacing.xl, textAlign: 'center' }}><span style={{ color: palette.brand.primary, fontSize: typography.size.xs, fontWeight: typography.weight.bold }}>{redirecting ? 'FINPET' : isLocalProvider ? 'INSCRIÇÃO' : 'PAGAMENTO'}</span><h1>{statusHeading}</h1><p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{statusMessage}</p>{!isLocalProvider && <strong>{orderStatus?.paymentStatus ?? 'Consultando...'}</strong>}{redirecting && orderStatus?.checkoutUrl && <p style={{ marginTop: spacing.lg }}><a href={orderStatus.checkoutUrl} style={{ color: palette.brand.primary, fontWeight: typography.weight.bold }}>Continuar para o pagamento</a></p>}<div style={{ marginTop: spacing.lg }}><a href="/" style={{ color: palette.brand.primary }}>Voltar aos cursos</a></div></section></div><style>{footerLogoStyle}</style><div style={{ padding: spacing.xl, display: 'grid', justifyItems: 'center' }}><button type="button" onClick={() => navigate('/')} className="course-footer-logo" style={{ border: 0, background: 'transparent', cursor: 'pointer' }}><BrandLogo size="sm" align="center" compact /></button></div></main>;
    }
    return <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', color: 'var(--text-primary)' }}><div style={{ flex: 1, display: 'grid', placeItems: 'center' }}><div><p>Selecione uma turma para continuar.</p><a href="/" style={{ color: palette.brand.primary }}>Voltar aos cursos</a></div></div><style>{footerLogoStyle}</style><div style={{ padding: spacing.xl, display: 'grid', justifyItems: 'center' }}><button type="button" onClick={() => navigate('/')} className="course-footer-logo" style={{ border: 0, background: 'transparent', cursor: 'pointer' }}><BrandLogo size="sm" align="center" compact /></button></div></main>;
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: `${spacing.xxl} ${spacing.xl}`, display: 'grid', gridTemplateColumns: '1fr 360px', gap: spacing.xxl, alignItems: 'start' }}>
        <form onSubmit={submit} style={{ display: 'grid', gap: spacing.md, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.lg, padding: spacing.xl }}>
          <div><span style={{ color: palette.brand.primary, fontSize: typography.size.xs, fontWeight: typography.weight.bold }}>INSCRIÇÃO</span><h1 style={{ margin: `${spacing.xs} 0 0`, fontSize: typography.size.xl }}>Finalizar matrícula</h1><p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>Preencha seus dados para reservar sua vaga.</p></div>
          <label style={{ display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)' }}>Nome completo<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" /></label>
          <label style={{ display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)' }}>E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" /></label>
          <label style={{ display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)' }}>CPF <small>opcional para o checkout local</small><input value={cpf} onChange={(event) => setCpf(event.target.value)} placeholder="000.000.000-00" /></label>
          {message && <div role="status" style={{ padding: spacing.md, borderRadius: radius.md, background: waitlistPosition ? '#fff7e5' : '#fcecec', color: waitlistPosition ? '#a16207' : '#b42318' }}>{message}{waitlistPosition && <strong style={{ display: 'block', marginTop: spacing.xs }}>Sua posição: {waitlistPosition}</strong>}</div>}
          {!waitlistPosition && <button type="submit" disabled={loading} style={{ border: 0, borderRadius: radius.pill, padding: `${spacing.md} ${spacing.lg}`, background: palette.brand.primary, color: '#fff', fontWeight: typography.weight.bold, cursor: loading ? 'wait' : 'pointer' }}>{loading ? 'Enviando...' : 'Confirmar inscrição'}</button>}
        </form>
        <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.lg, padding: spacing.xl, display: 'grid', gap: spacing.md }}><span style={{ color: 'var(--text-muted)', fontSize: typography.size.sm }}>Resumo</span><h2 style={{ margin: 0, fontSize: typography.size.lg }}>{state.courseTitle}</h2><div style={{ color: 'var(--text-secondary)' }}>Turma: {state.className}</div><div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: spacing.md, display: 'flex', justifyContent: 'space-between' }}><span>Total</span><strong style={{ fontSize: typography.size.lg }}>R$ {state.total}</strong></div><small style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>A vaga fica reservada temporariamente. Como ainda não há pagamento integrado, a confirmação da matrícula é feita manualmente pela nossa equipe.</small></aside>
      </div>
      <style>{footerLogoStyle}</style>
      <div style={{ padding: spacing.xl, display: 'grid', justifyItems: 'center' }}><button type="button" onClick={() => navigate('/')} className="course-footer-logo" style={{ border: 0, background: 'transparent', cursor: 'pointer' }}><BrandLogo size="sm" align="center" compact /></button></div>
    </main>
  );
};

export default CheckoutPage;
