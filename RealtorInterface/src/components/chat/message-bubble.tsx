import { motion } from 'framer-motion';
import { cn, formatTime } from '@/lib/utils';
import { Message, RoteiroStep, PaymentOption } from '@/lib/types';
import { RoadmapCard } from './roadmap-card';
import { PriceTable } from './price-table';

interface MessageBubbleProps {
  message: Message;
  onStepClick?: (step: RoteiroStep) => void;
  onVRClick?: () => void;
  onPaymentSelect?: (option: PaymentOption, entradaPercent: number, entradaValue: number) => void;
}

export function MessageBubble({
  message,
  onStepClick,
  onVRClick,
  onPaymentSelect,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Route to RoadmapCard if type === 'roadmap'
  if (message.type === 'roadmap') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="mb-4 flex w-full justify-start px-4"
      >
        <RoadmapCard
          showVRButton={message.showVRButton}
          onStepClick={onStepClick}
          onVRClick={onVRClick}
        />
      </motion.div>
    );
  }

  // Route to PriceTable if type === 'price-table'
  if (message.type === 'price-table') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="mb-4 flex w-full justify-start px-4"
      >
        <PriceTable onOptionSelect={onPaymentSelect} />
      </motion.div>
    );
  }

  // Standard text bubble
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      className={cn(
        'mb-3 flex w-full px-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
        <div
          className={cn(
            'rounded-3xl px-4 py-3 transition-shadow duration-200',
            isUser
              ? 'message-user rounded-br-lg'
              : 'message-assistant rounded-bl-lg'
          )}
        >
          <p
            className={cn(
              'text-[15px] leading-relaxed',
              isUser ? 'font-medium' : 'font-normal'
            )}
          >
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            'text-[10px] mt-1 text-[var(--text-muted)] dark:text-white/30',
            isUser ? 'text-right mr-1' : 'text-left ml-1'
          )}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

// Typing indicator component
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-3 flex w-full justify-start px-4"
    >
      <div className="message-assistant rounded-3xl rounded-bl-lg px-5 py-4">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-muted)] dark:bg-white/40" />
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-muted)] dark:bg-white/40" />
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-muted)] dark:bg-white/40" />
        </div>
      </div>
    </motion.div>
  );
}
