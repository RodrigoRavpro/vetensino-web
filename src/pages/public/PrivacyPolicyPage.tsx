import { LegalDocumentPage } from '../../components/public/LegalDocumentPage';

const sections = [
  {
    id: 'visao-geral',
    title: 'Visão geral',
    content: <><p>O VetEnsino é uma plataforma de capacitação para profissionais, instrutores, clínicas e hospitais veterinários.</p><p>Tratamos dados pessoais conforme a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD) e demais normas aplicáveis.</p></>,
  },
  {
    id: 'dados-coletados',
    title: 'Dados coletados',
    content: <><p>Podemos coletar dados fornecidos por você e informações geradas durante o uso da plataforma:</p><ul><li>nome, e-mail, telefone e credenciais de acesso;</li><li>perfil profissional e vínculo com organizações;</li><li>matrículas, progresso e conclusão de treinamentos;</li><li>conteúdos, cursos e turmas publicados por instrutores;</li><li>endereço IP, navegador, dispositivo e registros de segurança;</li><li>dados necessários ao pagamento, tratados pelo respectivo provedor.</li></ul></>,
  },
  {
    id: 'uso-dos-dados',
    title: 'Como usamos os dados',
    content: <><p>Utilizamos os dados para administrar contas, autenticar usuários, disponibilizar cursos e turmas, acompanhar progresso, prestar suporte, processar solicitações, melhorar a plataforma, prevenir fraude e cumprir obrigações legais.</p></>,
  },
  {
    id: 'bases-legais',
    title: 'Bases legais',
    content: <><p>O tratamento pode se basear na execução de contrato, cumprimento de obrigação legal, exercício regular de direitos, legítimo interesse, proteção do crédito ou consentimento, conforme a finalidade.</p></>,
  },
  {
    id: 'compartilhamento',
    title: 'Compartilhamento',
    content: <><p>Dados estritamente necessários podem ser compartilhados com provedores de infraestrutura, comunicação, segurança, pagamento e suporte; instrutores ou organizações responsáveis pelas turmas; e autoridades, quando legalmente exigido.</p><p>Não comercializamos dados pessoais.</p></>,
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: <><p>Utilizamos cookies essenciais para autenticação, segurança e funcionamento. Tecnologias de medição poderão ser usadas para melhorar a experiência, observadas as preferências aplicáveis.</p></>,
  },
  {
    id: 'seguranca',
    title: 'Retenção e segurança',
    content: <><p>Mantemos dados pelo período necessário às finalidades informadas, obrigações legais e defesa de direitos. Adotamos medidas técnicas e administrativas para reduzir riscos de acesso, perda, alteração ou divulgação indevida.</p></>,
  },
  {
    id: 'direitos',
    title: 'Direitos do titular',
    content: <><p>Você pode solicitar confirmação e acesso, correção, anonimização, bloqueio, eliminação, portabilidade, informações sobre compartilhamento, revogação de consentimento e revisão de decisões automatizadas, quando aplicável.</p><p>Para sua segurança, poderemos solicitar confirmação de identidade.</p></>,
  },
  {
    id: 'contato',
    title: 'Contato e alterações',
    content: <><p>Para exercer direitos ou esclarecer dúvidas, utilize os canais oficiais disponibilizados pelo VetEnsino. Esta política poderá ser atualizada; a versão vigente e a data da alteração permanecerão publicadas nesta página.</p></>,
  },
];

export const PrivacyPolicyPage = () => (
  <LegalDocumentPage
    eyebrow="Legal / Privacidade"
    title="Política de Privacidade"
    description="Como o VetEnsino coleta, utiliza, armazena e protege dados pessoais durante o uso da plataforma."
    updatedAt="25 de setembro de 2026"
    sections={sections}
  />
);

export default PrivacyPolicyPage;