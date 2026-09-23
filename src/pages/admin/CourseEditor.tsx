import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toPng } from 'html-to-image';
import { api } from '../../services/api';
import { density, palette, radius, spacing, typography } from '../../styles/designSystem';

type CourseClass = { id: string; name: string; capacity: number; status: string };
type Course = { id: string; title: string; subtitle?: string | null; slug: string; description: string | null; coverImageUrl?: string | null; price: string; promoPrice?: string | null; workloadHours: number | null; instructorId: string | null; status: string; certificateEnabled?: boolean; contentJson?: Record<string, unknown> | null; classes: CourseClass[] };
type Teacher = { id: string; name: string; email: string };
type CourseBlock = { id: string; type: 'text' | 'image' | 'outcomes' | 'syllabus' | 'bonuses'; title: string; body: string; imageUrl: string; items: string[] };
type SponsorSize = 'small' | 'medium' | 'large';
type Sponsor = { id: string; logoUrl: string; name: string; size: SponsorSize };
type RegistrationField = 'name' | 'email' | 'phone' | 'company';
type CourseContent = { eyebrow: string; heroImageUrl: string; audience: string; outcomes: string[]; syllabus: string[]; bonuses: string[]; blocks: CourseBlock[]; sponsors: Sponsor[]; preRegistrationEnabled: boolean; preRegistrationTitle: string; preRegistrationDescription: string; preRegistrationButtonLabel: string; preRegistrationFields: RegistrationField[] };
type EditorState = { title: string; subtitle: string; slug: string; description: string; coverImageUrl: string; price: string; promoPrice: string; workloadHours: string; instructorId: string; className: string; capacity: string; content: CourseContent };

type Props = { course: Course; onClose: () => void; onSaved: () => Promise<void> };

const asList = (value: unknown, fallback: string[]): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
const asSponsors = (value: unknown): Sponsor[] => Array.isArray(value) ? value.filter((item): item is Sponsor => Boolean(item && typeof item === 'object' && typeof (item as Sponsor).id === 'string' && typeof (item as Sponsor).logoUrl === 'string')).map((item) => ({ id: item.id, logoUrl: item.logoUrl, name: typeof item.name === 'string' ? item.name.slice(0, 120) : '', size: item.size === 'small' || item.size === 'large' ? item.size : 'medium' })) : [];
const asBlocks = (value: unknown, outcomes: string[], syllabus: string[], bonuses: string[]): CourseBlock[] => {
  if (Array.isArray(value)) return value.filter((item): item is CourseBlock => Boolean(item && typeof item === 'object' && typeof (item as CourseBlock).id === 'string' && typeof (item as CourseBlock).type === 'string'));
  return [
    { id: 'outcomes', type: 'outcomes', title: 'Você vai aprender', body: '', imageUrl: '', items: outcomes },
    { id: 'syllabus', type: 'syllabus', title: 'Programa', body: '', imageUrl: '', items: syllabus },
    { id: 'bonuses', type: 'bonuses', title: 'Bônus', body: '', imageUrl: '', items: bonuses },
  ];
};
const defaults = (course: Course): EditorState => {
  const content = course.contentJson ?? {};
  return {
    title: course.title,
    subtitle: course.subtitle ?? '',
    slug: course.slug,
    description: course.description ?? '',
    coverImageUrl: course.coverImageUrl ?? '',
    price: course.price,
    promoPrice: course.promoPrice ?? '',
    workloadHours: course.workloadHours?.toString() ?? '',
    instructorId: course.instructorId ?? '',
    className: course.classes[0]?.name ?? '',
    capacity: course.classes[0]?.capacity.toString() ?? '20',
    content: {
      eyebrow: typeof content.eyebrow === 'string' ? content.eyebrow : 'Formação VetEnsino',
      heroImageUrl: typeof content.heroImageUrl === 'string' ? content.heroImageUrl : '',
      audience: typeof content.audience === 'string' ? content.audience : 'Profissionais que desejam evoluir sua prática.',
      outcomes: asList(content.outcomes, ['Conteúdo prático e aplicável', 'Acompanhamento especializado']),
      syllabus: asList(content.syllabus, ['Fundamentos', 'Aplicação prática', 'Casos e exercícios']),
      bonuses: asList(content.bonuses, ['Material complementar', 'Certificado de conclusão']),
      blocks: asBlocks(content.blocks, asList(content.outcomes, ['Conteúdo prático e aplicável']), asList(content.syllabus, ['Fundamentos', 'Aplicação prática', 'Casos e exercícios']), asList(content.bonuses, ['Material complementar', 'Certificado de conclusão'])),
      sponsors: asSponsors(content.sponsors),
      preRegistrationEnabled: content.preRegistrationEnabled !== false,
      preRegistrationTitle: typeof content.preRegistrationTitle === 'string' ? content.preRegistrationTitle : 'Garanta seu lugar',
      preRegistrationDescription: typeof content.preRegistrationDescription === 'string' ? content.preRegistrationDescription : 'Deixe seu contato e receba as próximas informações.',
      preRegistrationButtonLabel: typeof content.preRegistrationButtonLabel === 'string' ? content.preRegistrationButtonLabel : 'Quero ser avisado',
      preRegistrationFields: Array.isArray(content.preRegistrationFields) ? content.preRegistrationFields.filter((field): field is RegistrationField => ['name', 'email', 'phone', 'company'].includes(String(field))) : ['name', 'email'],
    },
  };
};

const splitLines = (value: string): string[] => value.split('\n').map((item) => item.trim()).filter(Boolean);
const fieldStyle = { display: 'grid', gap: spacing.xs, color: 'var(--text-secondary)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, minHeight: density.controlHeight, padding: density.controlPadding, border: '1px solid var(--border-strong)', borderRadius: radius.sm, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: typography.fontFamily, fontSize: typography.size.sm };

export const CourseEditor = ({ course, onClose, onSaved }: Props) => {
  const [state, setState] = useState(() => defaults(course));
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [exportingBanner, setExportingBanner] = useState(false);
  const [exportingPage, setExportingPage] = useState(false);
  const [message, setMessage] = useState('');
  const [editorWidth, setEditorWidth] = useState(42);
  const [previewViewport, setPreviewViewport] = useState<'fluid' | 'desktop' | 'tablet' | 'mobile'>('fluid');
  const bannerRef = useRef<HTMLDivElement>(null);
  const pagePreviewRef = useRef<HTMLElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const update = (field: keyof EditorState, value: string) => setState((current) => ({ ...current, [field]: value }));
  const updateContent = (field: keyof CourseContent, value: string | boolean | string[]) => setState((current) => ({ ...current, content: { ...current.content, [field]: value } }));
  const content = state.content;

  useEffect(() => {
    void api.get<{ users: Teacher[] }>('/admin/users', { params: { role: 'TEACHER', limit: 100 } })
      .then((response) => setTeachers(response.data.users))
      .catch(() => setMessage('Não foi possível carregar os docentes.'));
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!resizingRef.current || !splitRef.current) return;
      const bounds = splitRef.current.getBoundingClientRect();
      const nextWidth = ((event.clientX - bounds.left) / bounds.width) * 100;
      setEditorWidth(Math.min(65, Math.max(30, nextWidth)));
    };
    const handlePointerUp = () => { resizingRef.current = false; document.body.classList.remove('course-editor-resizing'); };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp); };
  }, []);

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    resizingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    document.body.classList.add('course-editor-resizing');
  };

  const previewWidth = previewViewport === 'desktop' ? 1440 : previewViewport === 'tablet' ? 768 : previewViewport === 'mobile' ? 390 : undefined;

  const updateBlock = (id: string, patch: Partial<CourseBlock>) => setState((current) => ({ ...current, content: { ...current.content, blocks: current.content.blocks.map((block) => block.id === id ? { ...block, ...patch } : block) } }));
  const moveBlock = (fromId: string, toId: string) => setState((current) => {
    const blocks = [...current.content.blocks];
    const from = blocks.findIndex((block) => block.id === fromId);
    const to = blocks.findIndex((block) => block.id === toId);
    if (from < 0 || to < 0 || from === to) return current;
    const [moved] = blocks.splice(from, 1);
    blocks.splice(to, 0, moved);
    return { ...current, content: { ...current.content, blocks } };
  });
  const addBlock = (type: CourseBlock['type']) => setState((current) => ({ ...current, content: { ...current.content, blocks: [...current.content.blocks, { id: `${type}-${Date.now()}`, type, title: type === 'text' ? 'Novo texto' : 'Nova seção', body: '', imageUrl: '', items: ['Novo item'] }] } }));
  const removeBlock = (id: string) => setState((current) => ({ ...current, content: { ...current.content, blocks: current.content.blocks.filter((block) => block.id !== id) } }));
  const toggleRegistrationField = (field: RegistrationField) => setState((current) => {
    const fields = current.content.preRegistrationFields.includes(field) ? current.content.preRegistrationFields.filter((item) => item !== field) : [...current.content.preRegistrationFields, field];
    return { ...current, content: { ...current.content, preRegistrationFields: fields } };
  });

  const exportBanner = async () => {
    if (!bannerRef.current) return;
    setExportingBanner(true);
    try {
      const dataUrl = await toPng(bannerRef.current, { pixelRatio: 3, canvasWidth: 3600, canvasHeight: 1890, backgroundColor: '#171221', cacheBust: true });
      const link = document.createElement('a');
      link.download = `${state.slug || 'curso'}-banner.png`;
      link.href = dataUrl;
      link.click();
      setMessage('Banner exportado em alta resolução (3600 x 1890).');
    } catch { setMessage('Não foi possível gerar o banner.'); }
    finally { setExportingBanner(false); }
  };

  const exportPagePreview = async () => {
    if (!pagePreviewRef.current) return;
    setExportingPage(true);
    try {
      const dataUrl = await toPng(pagePreviewRef.current, { pixelRatio: 2, backgroundColor: 'var(--bg-base)', cacheBust: true });
      const link = document.createElement('a');
      link.download = `${state.slug || 'curso'}-pagina-preview.png`;
      link.href = dataUrl;
      link.click();
      setMessage('Preview completo exportado em PNG.');
    } catch { setMessage('Não foi possível exportar o preview completo.'); }
    finally { setExportingPage(false); }
  };

  const openPreviewInNewTab = () => {
    if (!pagePreviewRef.current) return;
    const previewWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!previewWindow) {
      setMessage('Permita pop-ups para abrir o preview em uma nova aba.');
      return;
    }
    previewWindow.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview - ${state.title.replace(/[<>&"']/g, '')}</title><style>*,*::before,*::after{box-sizing:border-box}body{margin:0;background:#0f0d14;color:#f5f3f7;font-family:Arial,sans-serif}.preview-shell{width:min(100%,1100px);margin:0 auto;padding:32px;background:#0f0d14}@media(max-width:700px){.preview-shell{padding:16px}}</style></head><body><div class="preview-shell">${pagePreviewRef.current.outerHTML}</div></body></html>`);
    previewWindow.document.close();
  };

  const uploadImage = async (file: File, target: 'cover' | 'hero') => {
    if (!file.type.startsWith('image/')) { setMessage('Selecione uma imagem JPG, PNG ou WebP.'); return; }
    setUploading(true);
    setMessage('Enviando imagem...');
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const response = await api.post<{ url: string }>('/storage/upload', { file: { base64, fileName: file.name, mimeType: file.type, size: file.size } });
      if (target === 'cover') setState((current) => ({ ...current, coverImageUrl: response.data.url }));
      else updateContent('heroImageUrl', response.data.url);
      setMessage('Imagem enviada. Salve o curso para confirmar.');
    } catch { setMessage('Não foi possível enviar a imagem. Verifique o storage.'); }
    finally { setUploading(false); }
  };

  const uploadSponsorLogo = async (file: File) => {
    if (!file.type.startsWith('image/')) { setMessage('Selecione uma imagem JPG, PNG ou WebP.'); return; }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const response = await api.post<{ url: string }>('/storage/upload', { file: { base64, fileName: file.name, mimeType: file.type, size: file.size } });
      setState((current) => ({ ...current, content: { ...current.content, sponsors: [...current.content.sponsors, { id: `sponsor-${Date.now()}`, logoUrl: response.data.url, name: '', size: 'medium' }] } }));
      setMessage('Logo adicionada. Salve o curso para confirmar.');
    } catch { setMessage('Não foi possível enviar o logo.'); }
    finally { setUploading(false); }
  };

  const updateSponsor = (id: string, patch: Partial<Sponsor>) => setState((current) => ({ ...current, content: { ...current.content, sponsors: current.content.sponsors.map((sponsor) => sponsor.id === id ? { ...sponsor, ...patch } : sponsor) } }));
  const moveSponsor = (fromId: string, toId: string) => setState((current) => {
    const sponsors = [...current.content.sponsors];
    const from = sponsors.findIndex((sponsor) => sponsor.id === fromId);
    const to = sponsors.findIndex((sponsor) => sponsor.id === toId);
    if (from < 0 || to < 0 || from === to) return current;
    const [moved] = sponsors.splice(from, 1);
    sponsors.splice(to, 0, moved);
    return { ...current, content: { ...current.content, sponsors } };
  });
  const removeSponsor = (id: string) => setState((current) => ({ ...current, content: { ...current.content, sponsors: current.content.sponsors.filter((sponsor) => sponsor.id !== id) } }));

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.patch(`/admin/courses/${course.id}`, {
        title: state.title,
        subtitle: state.subtitle || null,
        slug: state.slug,
        description: state.description || null,
        coverImageUrl: state.coverImageUrl || null,
        price: Number(state.price),
        promoPrice: state.promoPrice ? Number(state.promoPrice) : null,
        workloadHours: state.workloadHours ? Number(state.workloadHours) : null,
        instructorId: state.instructorId,
        certificateEnabled: true,
        contentJson: content,
      });
      const firstClass = course.classes[0];
      if (firstClass) await api.patch(`/admin/courses/${course.id}/classes/${firstClass.id}`, { name: state.className, capacity: Number(state.capacity) });
      setMessage('Curso salvo com sucesso.');
      await onSaved();
    } catch {
      setMessage('Não foi possível salvar o curso.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section ref={splitRef} className="course-editor-split" style={{ display: 'grid', gridTemplateColumns: `${editorWidth}% 10px ${100 - editorWidth}%`, gap: spacing.md, alignItems: 'start' }}>
      <form id="course-editor-form" onSubmit={save} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: radius.md, padding: density.panelPadding, display: 'grid', gap: density.sectionGap, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <div style={{ position: 'sticky', top: `-${density.panelPadding}`, zIndex: 3, margin: `-${density.panelPadding} -${density.panelPadding} 0`, padding: density.panelPadding, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}><h2 style={{ margin: 0, fontSize: typography.size.md }}>Editor do curso</h2><div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}><button type="button" onClick={onClose} style={{ border: 0, background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>Fechar</button><button type="submit" disabled={saving} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.sm} ${spacing.md}`, background: palette.brand.primary, color: '#fff', fontWeight: typography.weight.semibold, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Salvando...' : 'Salvar alterações'}</button></div></div>
        <label style={fieldStyle}>Título<input required value={state.title} onChange={(event) => update('title', event.target.value)} style={inputStyle} /></label>
        <label style={fieldStyle}>Subtítulo<input value={state.subtitle} onChange={(event) => update('subtitle', event.target.value)} style={inputStyle} /></label>
        <label style={fieldStyle}>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={state.slug} onChange={(event) => update('slug', event.target.value)} style={inputStyle} /></label>
        <label style={fieldStyle}>Docente<select required value={state.instructorId} onChange={(event) => update('instructorId', event.target.value)} style={inputStyle}><option value="">Selecione o docente</option>{teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.email})</option>)}</select></label>
        <label style={fieldStyle}>Descrição<ReactQuill theme="snow" value={state.description} onChange={(value) => update('description', value)} /></label>
        <label style={fieldStyle}>Imagem de capa<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file, 'cover'); }} style={inputStyle} /></label>
        {state.coverImageUrl && <img src={state.coverImageUrl} alt="Capa do curso" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: radius.sm }} />}
        <label style={fieldStyle}>Imagem de destaque<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file, 'hero'); }} style={inputStyle} /></label>
        {content.heroImageUrl && <img src={content.heroImageUrl} alt="Destaque do curso" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: radius.sm }} />}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}><label style={fieldStyle}>Preço<input type="number" min="0" step="0.01" value={state.price} onChange={(event) => update('price', event.target.value)} style={inputStyle} /></label><label style={fieldStyle}>Promoção<input type="number" min="0" step="0.01" value={state.promoPrice} onChange={(event) => update('promoPrice', event.target.value)} style={inputStyle} /></label></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: spacing.sm }}><label style={fieldStyle}>Turma<input value={state.className} onChange={(event) => update('className', event.target.value)} style={inputStyle} /></label><label style={fieldStyle}>Vagas<input type="number" min="1" value={state.capacity} onChange={(event) => update('capacity', event.target.value)} style={inputStyle} /></label></div>
        <label style={fieldStyle}>Carga horária<input type="number" min="1" value={state.workloadHours} onChange={(event) => update('workloadHours', event.target.value)} style={inputStyle} /></label>
        <label style={fieldStyle}>Chamada visual<input value={content.eyebrow} onChange={(event) => updateContent('eyebrow', event.target.value)} style={inputStyle} /></label>
        <label style={fieldStyle}>Público<textarea rows={2} value={content.audience} onChange={(event) => updateContent('audience', event.target.value)} style={{ ...inputStyle, resize: 'vertical' }} /></label>
        <label style={fieldStyle}>Resultados (um por linha)<textarea rows={3} value={content.outcomes.join('\n')} onChange={(event) => updateContent('outcomes', splitLines(event.target.value))} style={{ ...inputStyle, resize: 'vertical' }} /></label>
        <label style={fieldStyle}>Programa (um por linha)<textarea rows={3} value={content.syllabus.join('\n')} onChange={(event) => updateContent('syllabus', splitLines(event.target.value))} style={{ ...inputStyle, resize: 'vertical' }} /></label>
        <label style={fieldStyle}>Bônus (um por linha)<textarea rows={3} value={content.bonuses.join('\n')} onChange={(event) => updateContent('bonuses', splitLines(event.target.value))} style={{ ...inputStyle, resize: 'vertical' }} /></label>
        <section style={{ display: 'grid', gap: spacing.sm, borderTop: '1px solid var(--border-subtle)', paddingTop: spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}><strong>Blocos da página</strong><select value="" onChange={(event) => { if (event.target.value) addBlock(event.target.value as CourseBlock['type']); }} style={inputStyle}><option value="">Adicionar bloco...</option><option value="text">Texto rico</option><option value="image">Imagem</option><option value="outcomes">Resultados</option><option value="syllabus">Programa</option><option value="bonuses">Bônus</option></select></div>
          <span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs }}>Arraste os blocos para definir a ordem da página.</span>
          {content.blocks.map((block) => <div key={block.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/course-block', block.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); moveBlock(event.dataTransfer.getData('text/course-block'), block.id); }} style={{ display: 'grid', gap: spacing.xs, padding: spacing.sm, border: '1px solid var(--border-subtle)', borderRadius: radius.sm, background: 'var(--bg-base)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}><span aria-hidden="true" style={{ cursor: 'grab', color: 'var(--text-muted)' }}>⋮⋮</span><input value={block.title} onChange={(event) => updateBlock(block.id, { title: event.target.value })} style={{ ...inputStyle, flex: 1 }} /><button type="button" onClick={() => removeBlock(block.id)} style={{ border: 0, background: 'transparent', color: '#c6364d', cursor: 'pointer' }}>Remover</button></div>
            {block.type === 'text' && <ReactQuill theme="snow" value={block.body} onChange={(value) => updateBlock(block.id, { body: value })} />}
            {block.type === 'image' && <label style={fieldStyle}>URL da imagem<input value={block.imageUrl} onChange={(event) => updateBlock(block.id, { imageUrl: event.target.value })} style={inputStyle} /></label>}
            {['outcomes', 'syllabus', 'bonuses'].includes(block.type) && <textarea rows={3} value={block.items.join('\n')} onChange={(event) => updateBlock(block.id, { items: splitLines(event.target.value) })} style={{ ...inputStyle, resize: 'vertical' }} />}
          </div>)}
        </section>
        <section style={{ display: 'grid', gap: spacing.sm, borderTop: '1px solid var(--border-subtle)', paddingTop: spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}><strong>Patrocínio e apoio</strong><label style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, padding: `${spacing.xs} ${spacing.sm}`, color: palette.brand.primary, cursor: uploading ? 'wait' : 'pointer', fontSize: typography.size.xs }}>{uploading ? 'Enviando...' : 'Adicionar logo'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadSponsorLogo(file); }} style={{ display: 'none' }} /></label></div>
          <span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs }}>Nome opcional, tamanho e ordem definidos por patrocinador.</span>
          {content.sponsors.map((sponsor) => <div key={sponsor.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/sponsor', sponsor.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); moveSponsor(event.dataTransfer.getData('text/sponsor'), sponsor.id); }} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: spacing.sm, alignItems: 'center', padding: spacing.sm, border: '1px solid var(--border-subtle)', borderRadius: radius.sm, background: 'var(--bg-base)' }}>
            <img src={sponsor.logoUrl} alt="" style={{ width: 56, height: 40, objectFit: 'contain', background: '#fff', borderRadius: radius.sm }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: spacing.xs }}><input maxLength={120} value={sponsor.name} placeholder="Nome (opcional)" onChange={(event) => updateSponsor(sponsor.id, { name: event.target.value })} style={inputStyle} /><select value={sponsor.size} onChange={(event) => updateSponsor(sponsor.id, { size: event.target.value as SponsorSize })} style={inputStyle}><option value="small">Pequeno</option><option value="medium">Médio</option><option value="large">Grande</option></select></div>
            <button type="button" onClick={() => removeSponsor(sponsor.id)} style={{ border: 0, background: 'transparent', color: '#c6364d', cursor: 'pointer', fontSize: typography.size.xs }}>Remover</button>
          </div>)}
          {content.sponsors.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: typography.size.sm }}>Nenhum patrocinador adicionado.</span>}
        </section>
        <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: 'var(--text-secondary)', fontSize: typography.size.sm }}><input type="checkbox" checked={content.preRegistrationEnabled} onChange={(event) => updateContent('preRegistrationEnabled', event.target.checked)} /> Ativar widget de pré-inscrição</label>
        <label style={fieldStyle}>Título do widget<input value={content.preRegistrationTitle} onChange={(event) => updateContent('preRegistrationTitle', event.target.value)} style={inputStyle} /></label>
        <label style={fieldStyle}>Texto do widget<textarea rows={2} value={content.preRegistrationDescription} onChange={(event) => updateContent('preRegistrationDescription', event.target.value)} style={{ ...inputStyle, resize: 'vertical' }} /></label>
        <label style={fieldStyle}>Texto do botão<input value={content.preRegistrationButtonLabel} maxLength={80} onChange={(event) => updateContent('preRegistrationButtonLabel', event.target.value)} style={inputStyle} /></label>
        <fieldset style={{ border: '1px solid var(--border-subtle)', borderRadius: radius.sm, padding: spacing.sm, display: 'grid', gap: spacing.xs }}><legend style={{ color: 'var(--text-secondary)', fontSize: typography.size.xs }}>Campos do formulário</legend>{([['name', 'Nome'], ['email', 'E-mail'], ['phone', 'Telefone'], ['company', 'Empresa'] ] as const).map(([field, label]) => <label key={field} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: 'var(--text-secondary)', fontSize: typography.size.sm }}><input type="checkbox" checked={content.preRegistrationFields.includes(field)} disabled={field === 'email'} onChange={() => toggleRegistrationField(field)} /> {label}{field === 'email' ? ' (obrigatório)' : ''}</label>)}</fieldset>
        {message && <p style={{ margin: 0, color: message.includes('não') ? '#b42318' : '#149e61' }}>{message}</p>}
      </form>

      <div className="course-editor-resize-handle" role="separator" aria-label="Redimensionar editor e preview" aria-orientation="vertical" onPointerDown={startResize} style={{ width: 10, minHeight: 220, alignSelf: 'stretch', cursor: 'col-resize', borderRadius: radius.sm, background: 'var(--border-subtle)' }} />

      <div className="course-editor-preview" style={{ position: 'sticky', top: spacing.md, background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: radius.md, overflow: 'hidden', gridColumn: '3' }}>
        <div style={{ padding: `${spacing.sm} ${spacing.md}`, borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}><span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, textTransform: 'uppercase' }}>Preview em tempo real</span><div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}><select aria-label="Largura do preview" value={previewViewport} onChange={(event) => setPreviewViewport(event.target.value as typeof previewViewport)} style={{ ...inputStyle, width: 110, minHeight: 28, padding: '4px 6px', fontSize: typography.size.xs }}><option value="fluid">Fluido</option><option value="desktop">Desktop</option><option value="tablet">Tablet</option><option value="mobile">Mobile</option></select><button type="button" onClick={openPreviewInNewTab} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, padding: `${spacing.xs} ${spacing.sm}`, background: 'transparent', color: palette.brand.primary, fontSize: typography.size.xs, fontWeight: typography.weight.semibold }}>Nova aba</button><button type="button" onClick={() => void exportPagePreview()} disabled={exportingPage} style={{ border: `1px solid ${palette.brand.primary}`, borderRadius: radius.sm, padding: `${spacing.xs} ${spacing.sm}`, background: 'transparent', color: palette.brand.primary, fontSize: typography.size.xs, fontWeight: typography.weight.semibold, cursor: exportingPage ? 'wait' : 'pointer' }}>{exportingPage ? 'Exportando...' : 'Exportar página'}</button></div></div>
        <div style={{ padding: spacing.md, display: 'grid', gap: spacing.sm, borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}><strong>Banner de compartilhamento</strong><button type="button" onClick={() => void exportBanner()} disabled={exportingBanner} style={{ border: 0, borderRadius: radius.sm, padding: `${spacing.xs} ${spacing.sm}`, background: palette.brand.primary, color: '#fff', fontSize: typography.size.xs, fontWeight: typography.weight.semibold, cursor: exportingBanner ? 'wait' : 'pointer' }}>{exportingBanner ? 'Gerando...' : 'Baixar PNG HD'}</button></div>
          <div ref={bannerRef} style={{ position: 'relative', width: '100%', aspectRatio: '1200 / 630', overflow: 'hidden', borderRadius: radius.md, background: 'linear-gradient(120deg, #171221 0%, #3b2264 58%, #9b6bd2 100%)', color: '#fff', padding: '7%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {content.heroImageUrl && <img src={content.heroImageUrl} alt="" crossOrigin="anonymous" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28 }} />}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }}><strong style={{ fontSize: 'clamp(12px, 2vw, 24px)', letterSpacing: '0.08em' }}>VETENSINO</strong><span style={{ fontSize: 'clamp(10px, 1.5vw, 18px)', opacity: 0.85 }}>{content.eyebrow}</span></div>
            <div style={{ position: 'relative', maxWidth: '72%' }}><h2 style={{ margin: 0, fontSize: 'clamp(22px, 4vw, 58px)', lineHeight: 1.02, letterSpacing: '-0.04em' }}>{state.title || 'Título do curso'}</h2><p style={{ margin: '2% 0 0', fontSize: 'clamp(11px, 1.7vw, 24px)', lineHeight: 1.3, opacity: 0.86 }}>{state.subtitle || 'Aprenda com quem entende.'}</p></div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: spacing.md }}><span style={{ fontSize: 'clamp(12px, 2vw, 26px)', fontWeight: 700 }}>R$ {state.promoPrice || state.price}</span><span style={{ padding: '1.5% 3%', borderRadius: 999, background: '#fff', color: '#5d3eaa', fontSize: 'clamp(10px, 1.5vw, 18px)', fontWeight: 700 }}>Inscreva-se</span></div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: typography.size.xs }}>Formato 1200 × 630 · exportação 3600 × 1890 px</span>
        </div>
        <div style={{ overflowX: previewWidth ? 'auto' : 'hidden', padding: spacing.md, background: 'var(--bg-elevated)' }}><article ref={pagePreviewRef} style={{ width: previewWidth ? `${previewWidth}px` : '100%', maxWidth: '100%', margin: '0 auto', padding: spacing.xl, display: 'grid', gap: spacing.md, background: 'var(--bg-base)' }}>
          {content.heroImageUrl && <img src={content.heroImageUrl} alt="" style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: radius.md }} />}
          {state.coverImageUrl && <img src={state.coverImageUrl} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: radius.md }} />}
          <span style={{ color: palette.brand.primary, fontSize: typography.size.xs, fontWeight: typography.weight.bold, textTransform: 'uppercase' }}>{content.eyebrow}</span>
          <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: 1.05 }}>{state.title || 'Título do curso'}</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: typography.size.lg }}>{state.subtitle || state.description || 'Subtítulo do curso'}</p>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}><span style={{ padding: '6px 10px', borderRadius: radius.pill, background: palette.brand.subtle }}>{state.workloadHours || '0'}h</span><span style={{ padding: '6px 10px', borderRadius: radius.pill, background: palette.brand.subtle }}>{state.className || 'Turma'}</span><span style={{ padding: '6px 10px', borderRadius: radius.pill, background: palette.brand.subtle }}>{state.capacity || '0'} vagas</span></div>
          <section style={{ display: 'grid', gap: spacing.sm }}><h2 style={{ margin: 0, fontSize: typography.size.md }}>Você vai aprender</h2>{content.outcomes.map((item) => <div key={item} style={{ padding: spacing.sm, border: '1px solid var(--border-subtle)', borderRadius: radius.sm, color: 'var(--text-secondary)' }}>{item}</div>)}</section>
          <section><h2 style={{ fontSize: typography.size.md }}>Programa</h2><ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{content.syllabus.map((item) => <li key={item}>{item}</li>)}</ul></section>
          {content.blocks.map((block) => <section key={block.id} style={{ display: 'grid', gap: spacing.sm }}><h2 style={{ margin: 0, fontSize: typography.size.md }}>{block.title}</h2>{block.type === 'text' && <div style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: block.body }} />}{block.type === 'image' && block.imageUrl && <img src={block.imageUrl} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: radius.md }} />}{['outcomes', 'syllabus', 'bonuses'].includes(block.type) && block.items.map((item) => <div key={item} style={{ padding: spacing.sm, border: '1px solid var(--border-subtle)', borderRadius: radius.sm, color: 'var(--text-secondary)' }}>{item}</div>)}</section>)}
          {content.sponsors.length > 0 && <section style={{ display: 'grid', gap: spacing.sm }}><h2 style={{ margin: 0, fontSize: typography.size.md }}>Patrocínio e apoio</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: spacing.sm, alignItems: 'center' }}>{content.sponsors.map((sponsor) => <div key={sponsor.id} style={{ display: 'grid', gap: spacing.xs, justifyItems: 'center', padding: spacing.sm, border: '1px solid var(--border-subtle)', borderRadius: radius.sm, background: '#fff' }}><img src={sponsor.logoUrl} alt={sponsor.name || 'Patrocinador'} style={{ width: sponsor.size === 'large' ? '100%' : sponsor.size === 'small' ? '55%' : '78%', height: 48, objectFit: 'contain' }} />{sponsor.name && <span style={{ fontSize: typography.size.xs, color: 'var(--text-muted)' }}>{sponsor.name}</span>}</div>)}</div></section>}
          {content.preRegistrationEnabled && <section style={{ padding: spacing.md, borderRadius: radius.md, background: 'var(--bg-surface)', border: `1px solid ${palette.brand.subtle}`, display: 'grid', gap: spacing.sm }}><strong>{content.preRegistrationTitle}</strong><span style={{ color: 'var(--text-secondary)', fontSize: typography.size.sm }}>{content.preRegistrationDescription}</span><input placeholder="Seu nome" disabled style={inputStyle} /><input placeholder="Seu e-mail" disabled style={inputStyle} /><button type="button" disabled style={{ border: 0, borderRadius: radius.sm, padding: spacing.sm, background: palette.brand.primary, color: '#fff' }}>Quero ser avisado</button></section>}
        </article></div>
      </div>
    </section>
  );
};
