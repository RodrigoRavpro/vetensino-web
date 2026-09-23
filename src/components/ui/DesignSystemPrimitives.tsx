import { useId, useState, type ChangeEvent, type CSSProperties, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { density, palette, radius, spacing, typography } from '../../styles/designSystem';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean };

const panelStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.md };

export const Button = ({ variant = 'primary', loading = false, children, disabled, style, ...props }: ButtonProps) => {
  const colors: Record<ButtonVariant, { background: string; color: string; border: string }> = {
    primary: { background: palette.brand.primary, color: '#fff', border: palette.brand.primary },
    secondary: { background: 'transparent', color: 'var(--brand-primary)', border: 'var(--brand-primary)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', border: 'var(--border-subtle)' },
    danger: { background: 'transparent', color: 'var(--state-danger)', border: 'var(--state-danger)' },
  };
  const color = colors[variant];
  return <button {...props} disabled={disabled || loading} style={{ minHeight: density.controlHeight, padding: density.controlPadding, border: `1px solid ${color.border}`, borderRadius: radius.sm, background: color.background, color: color.color, fontFamily: typography.fontFamily, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, opacity: disabled || loading ? 0.55 : 1, ...style }}>{loading ? 'Carregando...' : children}</button>;
};

export const Badge = ({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' }) => {
  const tones = { brand: ['var(--brand-subtle)', 'var(--brand-light)'], success: ['rgba(63,185,80,.14)', 'var(--state-success)'], warning: ['rgba(210,153,34,.16)', 'var(--state-warning)'], danger: ['rgba(248,81,73,.14)', 'var(--state-danger)'], neutral: ['var(--bg-elevated)', 'var(--text-secondary)'] } as const;
  const [background, color] = tones[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content', padding: '3px 8px', borderRadius: radius.pill, background, color, fontSize: typography.size.xs, fontWeight: typography.weight.semibold }}>{children}</span>;
};

export const Alert = ({ title, children, tone = 'info' }: { title: string; children: ReactNode; tone?: 'info' | 'success' | 'warning' | 'danger' }) => {
  const colors = { info: 'var(--state-info, #58a6ff)', success: 'var(--state-success)', warning: 'var(--state-warning)', danger: 'var(--state-danger)' };
  return <div role={tone === 'danger' ? 'alert' : 'status'} style={{ display: 'grid', gap: spacing.xs, padding: spacing.md, borderLeft: `3px solid ${colors[tone]}`, background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: typography.size.sm }}><strong style={{ color: 'var(--text-primary)' }}>{title}</strong><span>{children}</span></div>;
};

export const Field = ({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) => {
  const fieldId = useId();
  return <div style={{ display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)', fontSize: typography.size.sm, fontWeight: typography.weight.semibold }}><label htmlFor={fieldId}>{label}</label><div id={fieldId}>{children}</div>{error ? <span style={{ color: 'var(--state-danger)', fontSize: typography.size.xs }}>{error}</span> : hint ? <span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs, fontWeight: typography.weight.regular }}>{hint}</span> : null}</div>;
};

const inputStyle = { width: '100%', minHeight: density.controlHeight, padding: density.controlPadding, border: '1px solid var(--border-strong)', borderRadius: radius.sm, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm };
export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} style={{ ...inputStyle, ...props.style }} />;
export const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} style={{ ...inputStyle, ...props.style }} />;
export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} style={{ ...inputStyle, minHeight: 80, resize: 'vertical', ...props.style }} />;

export const Progress = ({ value, label = 'Progresso' }: { value: number; label?: string }) => <div style={{ display: 'grid', gap: spacing.xs }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.sm, color: 'var(--text-secondary)', fontSize: typography.size.xs }}><span>{label}</span><strong>{value}%</strong></div><div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label} style={{ height: 8, overflow: 'hidden', borderRadius: radius.pill, background: 'var(--bg-elevated)' }}><div style={{ width: `${value}%`, height: '100%', borderRadius: radius.pill, background: palette.brand.primary, transition: 'width 180ms ease' }} /></div></div>;

export const Tabs = ({ items, active, onChange }: { items: string[]; active: string; onChange: (item: string) => void }) => <div role="tablist" style={{ display: 'flex', gap: spacing.md, overflowX: 'auto', borderBottom: '1px solid var(--border-subtle)' }}>{items.map((item) => <button key={item} type="button" role="tab" aria-selected={active === item} onClick={() => onChange(item)} style={{ padding: `${spacing.sm} 2px`, border: 0, borderBottom: `2px solid ${active === item ? palette.brand.primary : 'transparent'}`, background: 'transparent', color: active === item ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: typography.weight.semibold, whiteSpace: 'nowrap' }}>{item}</button>)}</div>;

export const CourseCard = ({ title, category, progress }: { title: string; category: string; progress: number }) => <article style={{ ...panelStyle, overflow: 'hidden' }}><div style={{ height: 82, background: `linear-gradient(120deg, ${palette.brand.dark}, ${palette.brand.light})`, padding: spacing.md, display: 'flex', alignItems: 'end' }}><Badge tone="brand">{category}</Badge></div><div style={{ display: 'grid', gap: spacing.md, padding: spacing.md }}><div><h3 style={{ margin: 0, fontSize: typography.size.md }}>{title}</h3><p style={{ margin: `${spacing.xs} 0 0`, color: 'var(--text-secondary)', fontSize: typography.size.sm }}>Formação profissional VetEnsino</p></div><Progress value={progress} label="Concluído" /><Button variant="secondary">Continuar curso</Button></div></article>;

export const Modal = ({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) => open ? <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'grid', placeItems: 'center', padding: spacing.md, background: 'rgba(15,13,20,.68)' }}><section role="dialog" aria-modal="true" aria-labelledby="design-modal-title" style={{ ...panelStyle, width: 'min(100%, 420px)', padding: spacing.lg, display: 'grid', gap: spacing.md, boxShadow: '0 16px 48px rgba(0,0,0,.28)' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md, alignItems: 'center' }}><h2 id="design-modal-title" style={{ margin: 0, fontSize: typography.size.lg }}>{title}</h2><Button variant="ghost" aria-label="Fechar janela" onClick={onClose}>Fechar</Button></div>{children}</section></div> : null;

export const FileUpload = () => {
  const [file, setFile] = useState('');
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0]?.name ?? '');
  return <div style={{ display: 'grid', gap: spacing.sm, padding: spacing.lg, border: '1px dashed var(--border-strong)', borderRadius: radius.md, background: 'var(--bg-base)', textAlign: 'center' }}><strong>{file || 'Arraste um material ou selecione um arquivo'}</strong><span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs }}>PDF, vídeo ou apresentação até 100 MB</span><label style={{ justifySelf: 'center', minHeight: density.controlHeight, padding: density.controlPadding, border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, color: 'var(--brand-primary)', fontSize: typography.size.sm, fontWeight: typography.weight.semibold, cursor: 'pointer' }}>Selecionar arquivo<input type="file" onChange={handleChange} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }} /></label></div>;
};

export const DemoPanel = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <div style={{ ...panelStyle, padding: density.panelPadding, ...style }}>{children}</div>;