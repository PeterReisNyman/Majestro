import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Sun, Moon, ChevronLeft } from 'lucide-react';
import { MessageBubble, TypingIndicator } from '@/components/chat/message-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { cn, generateId } from '@/lib/utils';
import {
  Message,
  RoadmapStep,
  PaymentOption,
  DEMO_CONVERSATIONS,
  ChatConversation,
} from '@/lib/types';
import { Toaster, toast } from 'sonner';

interface ChatPageProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function ChatPage({ isDarkMode, onToggleTheme }: ChatPageProps) {
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Handle conversation selection
  const handleSelectConversation = (conv: ChatConversation) => {
    setSelectedConversation(conv);
    setMessages(conv.messages);
    setIsInputExpanded(false);
  };

  // Handle back to conversation list
  const handleBack = () => {
    setSelectedConversation(null);
    setMessages([]);
    setIsInputExpanded(false);
  };

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      type: 'text',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setIsInputExpanded(false);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Determine response type based on keywords
    const lowerContent = content.toLowerCase();
    const isRoadmapRequest =
      lowerContent.includes('roteiro') ||
      lowerContent.includes('roadmap') ||
      lowerContent.includes('xyz');
    const isPriceRequest =
      lowerContent.includes('preço') ||
      lowerContent.includes('tabela') ||
      lowerContent.includes('pagamento') ||
      lowerContent.includes('price');

    let aiMsg: Message;

    if (isRoadmapRequest) {
      aiMsg = {
        id: generateId(),
        role: 'assistant',
        content: 'Aqui está o roteiro completo para a compra do seu imóvel:',
        type: 'roadmap',
        showVRButton: Math.random() > 0.5, // Randomly show VR button for demo
        timestamp: new Date(),
      };
    } else if (isPriceRequest) {
      aiMsg = {
        id: generateId(),
        role: 'assistant',
        content: 'Aqui está a tabela de pagamentos disponíveis:',
        type: 'price-table',
        timestamp: new Date(),
      };
    } else {
      aiMsg = {
        id: generateId(),
        role: 'assistant',
        content:
          'Entendi! Posso ajudá-lo com o roteiro de compra do imóvel ou mostrar a tabela de preços. O que você prefere ver?',
        type: 'text',
        timestamp: new Date(),
      };
    }

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  // Handle roadmap step click
  const handleStepClick = (step: RoadmapStep) => {
    toast.success(`${step.titlePt}`, {
      description: step.descriptionPt,
      duration: 3000,
    });
  };

  // Handle VR button click
  const handleVRClick = () => {
    toast.info('Iniciando Tour VR...', {
      description: 'Preparando experiência imersiva do imóvel',
      duration: 4000,
    });
  };

  // Handle payment option click
  const handlePaymentClick = (option: PaymentOption) => {
    toast.success(`${option.methodPt} selecionado`, {
      description: `Total: ${option.totalAmount} em ${option.installments}x`,
      duration: 3000,
    });
  };

  // Handle click outside to close input
  const handleBackdropClick = () => {
    if (isInputExpanded) {
      setIsInputExpanded(false);
    }
  };

  return (
    <div className={cn('relative w-full h-screen flex flex-col overflow-hidden', isDarkMode && 'dark')}>
      {/* Toast notifications */}
      <Toaster
        theme={isDarkMode ? 'dark' : 'light'}
        position="top-center"
        toastOptions={{
          className: 'glass-card',
          style: {
            background: isDarkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
          },
        }}
      />

      {/* Animated Background Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[var(--green-primary-light)]/10 dark:bg-[var(--green-primary-dark)]/15 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[var(--orange-primary-light)]/10 dark:bg-[var(--orange-primary-dark)]/12 blur-[120px]"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 glass-panel border-b border-gray-200/20 dark:border-white/10 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            {selectedConversation ? (
              <button
                onClick={handleBack}
                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-[var(--text-primary)] dark:text-white" />
              </button>
            ) : (
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]">
                <MessageSquare className="h-5 w-5 text-white dark:text-black" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)] dark:text-white">
                {selectedConversation ? selectedConversation.title : 'Realtor AI'}
              </h1>
              <p className="text-xs text-[var(--text-secondary)] dark:text-white/50">
                {selectedConversation ? 'Conversa ativa' : 'Assistente Imobiliário'}
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.div
                  key="sun"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                >
                  <Sun className="h-5 w-5 text-[var(--orange-primary-dark)]" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                >
                  <Moon className="h-5 w-5 text-[var(--text-secondary)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="relative z-10 flex-1 overflow-hidden"
        onClick={handleBackdropClick}
      >
        <AnimatePresence mode="wait">
          {!selectedConversation ? (
            // Conversation List
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto scrollbar-thin p-4"
            >
              <div className="max-w-2xl mx-auto space-y-3">
                <h2 className="text-sm font-medium text-[var(--text-muted)] dark:text-white/40 uppercase tracking-wide px-2 mb-4">
                  Conversas de Demonstração
                </h2>

                {DEMO_CONVERSATIONS.map((conv, index) => (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelectConversation(conv)}
                    className={cn(
                      'w-full glass-card rounded-2xl p-4 text-left',
                      'transition-all duration-200',
                      'hover:scale-[1.02] active:scale-[0.98]',
                      'hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,255,136,0.1)]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-full',
                          index === 0
                            ? 'bg-[var(--green-primary-light)]/10 dark:bg-[var(--green-primary-dark)]/20'
                            : 'bg-[var(--orange-primary-light)]/10 dark:bg-[var(--orange-primary-dark)]/20'
                        )}
                      >
                        <MessageSquare
                          className={cn(
                            'h-6 w-6',
                            index === 0
                              ? 'text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]'
                              : 'text-[var(--orange-primary-light)] dark:text-[var(--orange-primary-dark)]'
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--text-primary)] dark:text-white truncate">
                          {conv.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] dark:text-white/50 truncate">
                          {conv.messages[conv.messages.length - 1]?.content.slice(0, 50)}...
                        </p>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] dark:text-white/30">
                        {conv.messages.length} msgs
                      </span>
                    </div>
                  </motion.button>
                ))}

                {/* Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 glass-subtle rounded-2xl p-4"
                >
                  <p className="text-sm text-[var(--text-secondary)] dark:text-white/60 text-center">
                    Selecione uma conversa para ver a demonstração ou clique no botão{' '}
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)] mx-1">
                      <Plus className="h-3 w-3 text-white dark:text-black" />
                    </span>{' '}
                    para iniciar uma nova.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            // Chat Messages
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={scrollRef}
              className="h-full overflow-y-auto scrollbar-thin pb-32"
            >
              <div className="max-w-2xl mx-auto py-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      onStepClick={handleStepClick}
                      onVRClick={handleVRClick}
                      onPaymentClick={handlePaymentClick}
                    />
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Chat Input - Only show when conversation is selected */}
      {selectedConversation && (
        <ChatInput
          onSend={handleSendMessage}
          isExpanded={isInputExpanded}
          onExpandedChange={setIsInputExpanded}
          disabled={isTyping}
        />
      )}

      {/* Floating button for starting new chat from list view */}
      {!selectedConversation && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'flex h-14 w-14 items-center justify-center',
            'rounded-full bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]',
            'shadow-lg dark:shadow-[0_0_30px_rgba(0,255,136,0.4)]',
            'transition-transform duration-200 hover:scale-105 active:scale-95',
            'touch-target'
          )}
          onClick={() => {
            // Start a new empty conversation
            const newConv: ChatConversation = {
              id: generateId(),
              title: 'Nova Conversa',
              messages: [
                {
                  id: generateId(),
                  role: 'assistant',
                  content:
                    'Olá! Sou seu assistente imobiliário. Como posso ajudá-lo hoje? Você pode perguntar sobre roteiros de compra ou tabelas de preços.',
                  type: 'text',
                  timestamp: new Date(),
                },
              ],
            };
            handleSelectConversation(newConv);
          }}
        >
          <Plus className="h-7 w-7 text-white dark:text-black" strokeWidth={2.5} />
        </motion.button>
      )}
    </div>
  );
}

// Plus icon component for inline use
function Plus({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
