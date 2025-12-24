import { useState, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useDragControls,
  AnimatePresence,
} from 'framer-motion';
import { Plus, Mic, ArrowUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  isExpanded,
  onExpandedChange,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const controls = useDragControls();

  // Motion values for drag gesture
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [1, 0.3]);
  const scale = useTransform(y, [0, 100], [1, 0.95]);

  // Auto-focus when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle drag end - dismiss if dragged down enough
  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y > 50) {
      // Dismiss the input
      inputRef.current?.blur();
      setIsFocused(false);
      onExpandedChange(false);
    }
    // Reset position
    y.set(0);
  };

  // Handle submit
  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
    }
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle click on collapsed button
  const handleExpand = () => {
    onExpandedChange(true);
  };

  // Handle close button
  const handleClose = () => {
    onExpandedChange(false);
    setValue('');
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className="relative w-full safe-area-bottom">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed State - Floating Button (iOS 26 style)
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={handleExpand}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'flex h-14 w-14 items-center justify-center',
              'rounded-full bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]',
              'shadow-lg dark:shadow-[0_0_30px_rgba(0,255,136,0.4)]',
              'transition-transform duration-200 hover:scale-105 active:scale-95',
              'touch-target'
            )}
          >
            <Plus className="h-7 w-7 text-white dark:text-black" strokeWidth={2.5} />
          </motion.button>
        ) : (
          // Expanded State - Full Input Panel
          <motion.div
            key="expanded"
            drag="y"
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 150 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ y, opacity, scale }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'glass-panel rounded-t-3xl p-4 pb-6',
              'safe-area-bottom'
            )}
          >
            {/* Drag Handle */}
            <div
              onPointerDown={(e) => controls.start(e)}
              className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-400/30 dark:bg-white/20 cursor-grab active:cursor-grabbing"
            />

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 dark:text-white/40 hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Input Container */}
            <div className="mt-4 flex items-end gap-2">
              {/* Attachment Button */}
              <button
                className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 dark:text-white/50 hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>

              {/* Text Input */}
              <div
                className={cn(
                  'flex-1 rounded-2xl px-4 py-2.5 transition-all duration-200',
                  'bg-gray-100 dark:bg-white/10',
                  'border-2',
                  isFocused
                    ? 'border-[var(--green-primary-light)] dark:border-[var(--green-primary-dark)]'
                    : 'border-transparent'
                )}
              >
                <textarea
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Digite sua mensagem..."
                  disabled={disabled}
                  rows={1}
                  className={cn(
                    'w-full bg-transparent border-0 resize-none',
                    'text-[var(--text-primary)] dark:text-white',
                    'placeholder:text-gray-400 dark:placeholder:text-white/40',
                    'focus:outline-none focus:ring-0',
                    'text-[15px] leading-relaxed max-h-32',
                    'disabled:opacity-50'
                  )}
                  style={{
                    minHeight: '24px',
                    height: 'auto',
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                  }}
                />
              </div>

              {/* Send/Mic Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={hasValue ? handleSubmit : undefined}
                disabled={disabled}
                className={cn(
                  'flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                  'touch-target',
                  hasValue
                    ? 'bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)] text-white dark:text-black dark:shadow-[0_0_15px_rgba(0,255,136,0.4)]'
                    : 'text-gray-500 dark:text-white/50 hover:bg-gray-200/50 dark:hover:bg-white/10',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <AnimatePresence mode="wait">
                  {hasValue ? (
                    <motion.div
                      key="send"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mic"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Mic className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Quick suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide"
            >
              {['Quero ver o roteiro', 'Tabela de preços', 'Agendar visita'].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setValue(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium
                      bg-gray-200/50 dark:bg-white/10
                      text-[var(--text-secondary)] dark:text-white/60
                      hover:bg-gray-300/50 dark:hover:bg-white/20
                      transition-colors"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
