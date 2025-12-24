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

// Roadmap step status
export type RoadmapStepStatus = 'completed' | 'current' | 'upcoming';

// Roadmap step interface
export interface RoadmapStep {
  id: string;
  title: string;
  titlePt: string; // Portuguese translation
  description: string;
  descriptionPt: string;
  status: RoadmapStepStatus;
  icon: 'wallet' | 'search' | 'calendar' | 'handshake' | 'file-text' | 'key';
}

// Price table payment option
export interface PaymentOption {
  id: string;
  method: string;
  methodPt: string;
  monthlyAmount: string;
  totalAmount: string;
  downPaymentPercent: number;
  installments: number;
  highlight?: boolean;
}

// Chat conversation for demo purposes
export interface ChatConversation {
  id: string;
  title: string;
  messages: Message[];
}

// Roadmap data showing the property purchase journey
export const ROADMAP_DATA: RoadmapStep[] = [
  {
    id: '1',
    title: 'Financial Qualification',
    titlePt: 'Qualificação Financeira',
    description: 'Pre-approval and budget definition',
    descriptionPt: 'Pré-aprovação e definição de orçamento',
    status: 'completed',
    icon: 'wallet',
  },
  {
    id: '2',
    title: 'Property Search',
    titlePt: 'Busca de Imóveis',
    description: 'Curated list based on preferences',
    descriptionPt: 'Lista personalizada baseada em preferências',
    status: 'completed',
    icon: 'search',
  },
  {
    id: '3',
    title: 'Property Visits',
    titlePt: 'Visitas aos Imóveis',
    description: 'Schedule and attend viewings',
    descriptionPt: 'Agendar e realizar visitas',
    status: 'current',
    icon: 'calendar',
  },
  {
    id: '4',
    title: 'Negotiation',
    titlePt: 'Negociação',
    description: 'Price and terms negotiation',
    descriptionPt: 'Negociação de preço e condições',
    status: 'upcoming',
    icon: 'handshake',
  },
  {
    id: '5',
    title: 'Legal Documentation',
    titlePt: 'Documentação Legal',
    description: 'Contract review and signing',
    descriptionPt: 'Revisão e assinatura de contrato',
    status: 'upcoming',
    icon: 'file-text',
  },
  {
    id: '6',
    title: 'Property Transfer',
    titlePt: 'Transferência do Imóvel',
    description: 'Final payment and key handover',
    descriptionPt: 'Pagamento final e entrega das chaves',
    status: 'upcoming',
    icon: 'key',
  },
];

// Price table data
export const PRICE_TABLE_DATA: PaymentOption[] = [
  {
    id: '1',
    method: 'Monthly',
    methodPt: 'Mensal',
    monthlyAmount: 'R$ 3.500',
    totalAmount: 'R$ 420.000',
    downPaymentPercent: 20,
    installments: 120,
    highlight: false,
  },
  {
    id: '2',
    method: 'Quarterly',
    methodPt: 'Trimestral',
    monthlyAmount: 'R$ 10.200',
    totalAmount: 'R$ 408.000',
    downPaymentPercent: 25,
    installments: 40,
    highlight: true,
  },
  {
    id: '3',
    method: 'Semi-Annual',
    methodPt: 'Semestral',
    monthlyAmount: 'R$ 19.800',
    totalAmount: 'R$ 396.000',
    downPaymentPercent: 30,
    installments: 20,
    highlight: false,
  },
  {
    id: '4',
    method: 'Cash Payment',
    methodPt: 'À Vista',
    monthlyAmount: '-',
    totalAmount: 'R$ 350.000',
    downPaymentPercent: 100,
    installments: 1,
    highlight: false,
  },
];

// Demo conversation 1 - With VR Tour button
export const DEMO_CONVERSATION_1: Message[] = [
  {
    id: '1-1',
    role: 'assistant',
    content: 'Olá! Sou seu assistente imobiliário. Como posso ajudá-lo hoje?',
    type: 'text',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '1-2',
    role: 'user',
    content: 'Quero ver o roteiro XYZ',
    type: 'text',
    timestamp: new Date(Date.now() - 50000),
  },
  {
    id: '1-3',
    role: 'assistant',
    content: 'Aqui está o roteiro completo para a compra do seu imóvel:',
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
    content: 'Olá! Sou seu assistente imobiliário. Como posso ajudá-lo hoje?',
    type: 'text',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '2-2',
    role: 'user',
    content: 'Quero ver o roteiro para o apartamento 302',
    type: 'text',
    timestamp: new Date(Date.now() - 50000),
  },
  {
    id: '2-3',
    role: 'assistant',
    content: 'Aqui está o roteiro completo para a compra do seu imóvel:',
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
    title: 'Roteiro XYZ - Com Tour VR',
    messages: DEMO_CONVERSATION_1,
  },
  {
    id: 'conv-2',
    title: 'Apartamento 302 - Tabela de Preços',
    messages: DEMO_CONVERSATION_2,
  },
];
