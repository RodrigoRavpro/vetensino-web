export type Course = {
  slug: string;
  title: string;
  category: string;
  level: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  summary: string;
  outcomes: string[];
  syllabus: string[];
  bonuses: string[];
  audience: string;
  badge: string;
  accent: string;
};

export const courses: Course[] = [
  {
    slug: 'medicina-veterinaria',
    title: 'Medicina Veterinária',
    category: 'Saúde e diagnóstico',
    level: 'Iniciante',
    price: 499,
    originalPrice: 899,
    duration: '12 módulos',
    description:
      'Aprenda protocolos clínicos, manejo de rotina e ferramentas para melhorar a qualidade do atendimento veterinário.',
    summary:
      'Fortaleça sua decisão clínica e aprimore a rotina da sua clínica com conteúdo prático e aplicável no dia a dia.',
    outcomes: [
      'Fortalecer decisões clínicas com mais segurança',
      'Organizar melhor a rotina da clínica',
      'Aumentar a qualidade do atendimento veterinário',
    ],
    syllabus: [
      'Fundamentos de atendimento clínico e medicina preventiva',
      'Gestão de protocolos, fichas e fluxo de consulta',
      'Farmacologia aplicada e prescrição segura',
      'Casos reais com interpretação clínica e raciocínio',
      'Atendimento ao cliente, conversão e retenção de pacientes',
    ],
    bonuses: [
      'Acesso vitalício ao conteúdo',
      'Material complementar em PDF',
      'Lista de verificação de atendimento',
      'Contato com tutores durante o curso',
    ],
    audience: 'Ideal para veterinários, auxiliares, estudantes e profissionais que desejam evoluir no atendimento clínico e na rotina da clínica.',
    badge: 'Mais vendido',
    accent: '#5d3eaa',
  },
  {
    slug: 'cirurgia-e-procedimentos',
    title: 'Cirurgia e Procedimentos',
    category: 'Procedimentos',
    level: 'Intermediário',
    price: 399,
    originalPrice: 699,
    duration: '10 módulos',
    description:
      'Entenda a preparação, a execução e a recuperação de procedimentos com foco em segurança clínica e protocolo.',
    summary:
      'Aprenda a reduzir riscos, aumentar a segurança do paciente e melhorar a organização da sua rotina cirúrgica.',
    outcomes: [
      'Reduzir riscos em procedimentos',
      'Organizar melhor os protocolos de cirurgia',
      'Aumentar a segurança do paciente e da equipe',
    ],
    syllabus: [
      'Preparação do paciente e da equipe',
      'Anestesia e monitoramento clínico',
      'Técnicas de cirurgia e sutura',
      'Cuidados pós-operatórios',
      'Documentação e comunicação de alta',
    ],
    bonuses: [
      'Checklist cirúrgico em PDF',
      'Fluxo de acompanhamento clínico',
      'Materiais em vídeo com exemplos práticos',
      'Acesso ao grupo de dúvidas',
    ],
    audience: 'Público ideal para profissionais que atuam em hospitais veterinários, clínicas e procedimentos cirúrgicos.',
    badge: 'Popular',
    accent: '#c7911b',
  },
  {
    slug: 'gestao-clinica',
    title: 'Gestão Clínica',
    category: 'Negócios',
    level: 'Todos os níveis',
    price: 349,
    originalPrice: 599,
    duration: '9 módulos',
    description:
      'Melhore a gestão da clínica, processos internos, faturamento e experiência do cliente com uma abordagem prática.',
    summary:
      'Transforme processos operacionais em eficiência, melhor atendimento e mais previsibilidade para o negócio.',
    outcomes: [
      'Organizar melhor os fluxos da clínica',
      'Aumentar a conversão do atendimento',
      'Entender melhor faturamento e retenção',
    ],
    syllabus: [
      'Fluxos de atendimento e oportunidades de melhoria',
      'Gestão de agenda e produtividade',
      'Faturamento e protocolos de cobrança',
      'Experiência do cliente e retenção',
      'Estratégia para crescimento da clínica',
    ],
    bonuses: [
      'Modelo de gestão operacional',
      'Planilha de acompanhamento financeiro',
      'Checklist de atendimento',
      'Materiais de apoio em PDF',
    ],
    audience: 'Indicado para gestores, donos de clínicas, coordenadores e profissionais que querem otimizar a operação.',
    badge: 'Novo',
    accent: '#2e9f8e',
  },
];
