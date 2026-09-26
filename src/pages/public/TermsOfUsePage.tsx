import { LegalDocumentPage } from '../../components/public/LegalDocumentPage';

const sections = [
  {
    id: 'aceitacao',
    title: 'Aceitação dos termos',
    content: <><p>Estes Termos de Uso regulam o acesso e a utilização do VetEnsino. Ao criar uma conta ou utilizar a plataforma, você declara que leu e concorda com este documento e com a Política de Privacidade.</p><p>Caso não concorde, não utilize a plataforma.</p></>,
  },
  {
    id: 'plataforma',
    title: 'Serviços da plataforma',
    content: <><p>O VetEnsino permite criar, publicar, organizar, contratar e acompanhar treinamentos destinados à área veterinária. Funcionalidades podem variar conforme perfil, plano, curso ou turma.</p><p>Podemos aprimorar, modificar ou descontinuar funcionalidades, preservando direitos já adquiridos quando aplicável.</p></>,
  },
  {
    id: 'conta',
    title: 'Conta e responsabilidades',
    content: <><p>Você deve fornecer informações verdadeiras, manter seus dados atualizados e proteger suas credenciais. A conta é pessoal e não deve ser compartilhada.</p><p>Atividades realizadas com suas credenciais serão atribuídas à sua conta, salvo comunicação de uso indevido e comprovação em sentido contrário.</p></>,
  },
  {
    id: 'conduta',
    title: 'Uso permitido',
    content: <><p>É proibido utilizar a plataforma para:</p><ul><li>violar leis, direitos de terceiros ou regras profissionais aplicáveis;</li><li>publicar conteúdo ilícito, enganoso, discriminatório ou que viole propriedade intelectual;</li><li>interferir na segurança, disponibilidade ou integridade dos sistemas;</li><li>acessar contas, dados ou áreas sem autorização;</li><li>realizar engenharia reversa, coleta automatizada abusiva ou distribuição de código malicioso.</li></ul></>,
  },
  {
    id: 'conteudo',
    title: 'Conteúdos e propriedade intelectual',
    content: <><p>A plataforma, sua marca, interface, software e materiais institucionais são protegidos pela legislação aplicável.</p><p>Instrutores permanecem responsáveis pelos conteúdos que publicam e declaram possuir as autorizações necessárias. Ao publicar, concedem ao VetEnsino licença limitada para hospedar, reproduzir e disponibilizar o conteúdo conforme a finalidade contratada.</p><p>A matrícula não transfere propriedade sobre materiais do curso nem autoriza reprodução ou distribuição fora das permissões concedidas.</p></>,
  },
  {
    id: 'pagamentos',
    title: 'Contratações e pagamentos',
    content: <><p>Preços, formas de pagamento, disponibilidade, regras de cancelamento e condições específicas serão apresentados antes da contratação. Pagamentos poderão ser processados por terceiros sujeitos aos próprios termos.</p><p>Reembolsos observarão a legislação aplicável e as condições informadas no momento da compra.</p></>,
  },
  {
    id: 'responsabilidade',
    title: 'Responsabilidades e limitações',
    content: <><p>Conteúdos educacionais não substituem avaliação clínica, orientação técnica individualizada ou cumprimento das normas profissionais. Decisões tomadas com base nos treinamentos são de responsabilidade do profissional.</p><p>Empregamos esforços razoáveis para manter a plataforma segura e disponível, mas não garantimos funcionamento ininterrupto ou ausência absoluta de falhas.</p></>,
  },
  {
    id: 'suspensao',
    title: 'Suspensão e encerramento',
    content: <><p>O acesso poderá ser suspenso ou encerrado em caso de violação destes termos, risco à segurança, fraude, inadimplência ou determinação legal. Sempre que possível, o usuário será informado e poderá apresentar esclarecimentos.</p></>,
  },
  {
    id: 'alteracoes',
    title: 'Alterações e legislação',
    content: <><p>Estes termos podem ser atualizados para refletir mudanças legais, técnicas ou operacionais. Alterações relevantes poderão ser comunicadas pelos canais da plataforma.</p><p>Aplica-se a legislação brasileira. Eventuais controvérsias serão resolvidas pelo foro competente conforme as regras legais aplicáveis.</p></>,
  },
  {
    id: 'contato',
    title: 'Contato',
    content: <><p>Para dúvidas sobre estes Termos de Uso, utilize os canais oficiais de atendimento disponibilizados pelo VetEnsino.</p></>,
  },
];

export const TermsOfUsePage = () => (
  <LegalDocumentPage
    eyebrow="Legal / Condições de uso"
    title="Termos de Uso"
    description="As condições que regulam o acesso, a publicação de conteúdos e a utilização dos serviços do VetEnsino."
    updatedAt="25 de setembro de 2026"
    sections={sections}
  />
);

export default TermsOfUsePage;