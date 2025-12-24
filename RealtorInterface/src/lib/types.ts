// Message types for the chat system
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'roadmap' | 'price-table';
  timestamp: Date;
  // For roadmap messages - whether to show VR tour button
  showVRButton?: boolean;
}

// Roteiro step status
export type RoteiroStepStatus = 'completed' | 'current' | 'upcoming';

// Roteiro step interface - Property Presentation Guide
export interface RoteiroStep {
  id: string;
  title: string;
  description: string;
  details?: string[]; // Additional bullet points
  duration?: string; // Estimated time for this step
  status: RoteiroStepStatus;
  icon: 'user-check' | 'building' | 'door-open' | 'chef-hat' | 'bed' | 'trees' | 'settings' | 'handshake';
}

// Price table payment option (simplified - calculations done dynamically)
export interface PaymentOption {
  id: string;
  method: string;
  installments: number;
  frequency: string;
}

// Chat conversation for demo purposes
export interface ChatConversation {
  id: string;
  title: string;
  messages: Message[];
}

// Roteiro data - Property Presentation Guide for Realtors
export const ROTEIRO_DATA: RoteiroStep[] = [
  {
    id: '1',
    title: 'Recepção',
    description: 'Cumprimente o cliente, confirme preferências e crie rapport',
    details: [
      'Cumprimente pelo nome',
      'Confirme necessidades',
      'Crie conexão antes de entrar',
    ],
    duration: '2-3 min',
    status: 'completed',
    icon: 'user-check',
  },
  {
    id: '2',
    title: 'Visão Geral Externa',
    description: 'Fachada, segurança e infraestrutura da região',
    details: [
      'Destaque fachada e acabamentos',
      'Mencione segurança do condomínio',
      'Aponte escolas, mercados, transporte',
    ],
    duration: '3-5 min',
    status: 'completed',
    icon: 'building',
  },
  {
    id: '3',
    title: 'Entrada e Áreas Sociais',
    description: 'Sala de estar/jantar, iluminação e diferenciais',
    details: [
      'Iluminação natural e ventilação',
      'Metragem e layout',
      'Pé-direito, acabamentos, vista',
    ],
    duration: '5-7 min',
    status: 'current',
    icon: 'door-open',
  },
  {
    id: '4',
    title: 'Cozinha',
    description: 'Layout funcional, armários e área de serviço',
    details: [
      'Armários e bancadas',
      'Eletrodomésticos inclusos',
      'Área de serviço integrada ou separada',
    ],
    duration: '3-5 min',
    status: 'upcoming',
    icon: 'chef-hat',
  },
  {
    id: '5',
    title: 'Quartos',
    description: 'Suíte master, closets e quartos secundários',
    details: [
      'Comece pela suíte master',
      'Destaque closets e banheiros',
      'Orientação solar e versatilidade',
    ],
    duration: '5-7 min',
    status: 'upcoming',
    icon: 'bed',
  },
  {
    id: '6',
    title: 'Áreas Externas/Lazer',
    description: 'Varanda, quintal, churrasqueira e garagem',
    details: [
      'Varanda e área gourmet',
      'Piscina e churrasqueira',
      'Vagas de garagem',
    ],
    duration: '3-5 min',
    status: 'upcoming',
    icon: 'trees',
  },
  {
    id: '7',
    title: 'Diferenciais Técnicos',
    description: 'Idade do imóvel, instalações e documentação',
    details: [
      'Idade e reformas recentes',
      'Elétrica e hidráulica',
      'Documentação regularizada',
    ],
    duration: '2-3 min',
    status: 'upcoming',
    icon: 'settings',
  },
  {
    id: '8',
    title: 'Fechamento',
    description: 'Resuma benefícios, informe condições e próximos passos',
    details: [
      'Resuma os 3 principais benefícios',
      'Valor e condições de pagamento',
      '"O que mais chamou sua atenção?"',
    ],
    duration: '5-10 min',
    status: 'upcoming',
    icon: 'handshake',
  },
];

// Payment options are now defined dynamically in the PriceTable component

// Demo conversation 1 - With VR Tour button
export const DEMO_CONVERSATION_1: Message[] = [
  {
    id: '1-1',
    role: 'assistant',
    content: 'Olá! Sou o Majestro, seu assistente imobiliário. Como posso ajudá-lo hoje?',
    type: 'text',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '1-2',
    role: 'user',
    content: 'Quero ver o roteiro para apresentar o apartamento 501',
    type: 'text',
    timestamp: new Date(Date.now() - 50000),
  },
  {
    id: '1-3',
    role: 'assistant',
    content: 'Aqui está o roteiro de apresentação do imóvel:',
    type: 'roadmap',
    showVRButton: true,
    timestamp: new Date(Date.now() - 40000),
  },
];

// Demo conversation 2 - Without VR Tour, with Price Table
export const DEMO_CONVERSATION_2: Message[] = [
  {
    id: '2-1',
    role: 'assistant',
    content: 'Olá! Sou o Majestro, seu assistente imobiliário. Como posso ajudá-lo hoje?',
    type: 'text',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '2-2',
    role: 'user',
    content: 'Quero ver o roteiro para a casa 302',
    type: 'text',
    timestamp: new Date(Date.now() - 50000),
  },
  {
    id: '2-3',
    role: 'assistant',
    content: 'Aqui está o roteiro de apresentação do imóvel:',
    type: 'roadmap',
    showVRButton: false,
    timestamp: new Date(Date.now() - 40000),
  },
  {
    id: '2-4',
    role: 'user',
    content: 'Me dá a tabela de preços',
    type: 'text',
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: '2-5',
    role: 'assistant',
    content: 'Aqui está a tabela de pagamentos disponíveis:',
    type: 'price-table',
    timestamp: new Date(Date.now() - 20000),
  },
];

// All demo conversations
export const DEMO_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    title: 'Apartamento 501 - Com Tour VR',
    messages: DEMO_CONVERSATION_1,
  },
  {
    id: 'conv-2',
    title: 'Casa 302 - Tabela de Preços',
    messages: DEMO_CONVERSATION_2,
  },
];

// Legacy export for backwards compatibility
export const ROADMAP_DATA = ROTEIRO_DATA;
export type RoadmapStep = RoteiroStep;
export type RoadmapStepStatus = RoteiroStepStatus;
