import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PaymentOption {
  id: string;
  method: string;
  installments: number;
  frequency: string;
}

interface PriceTableProps {
  totalPrice?: number;
  minEntrada?: number;
  maxEntrada?: number;
  onOptionSelect?: (option: PaymentOption, entradaPercent: number, entradaValue: number) => void;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: '1', method: 'Mensal', installments: 120, frequency: 'mês' },
  { id: '2', method: 'Trimestral', installments: 40, frequency: 'trimestre' },
  { id: '3', method: 'Semestral', installments: 20, frequency: 'semestre' },
  { id: '4', method: 'À Vista', installments: 1, frequency: '' },
];

export function PriceTable({
  totalPrice = 350000,
  minEntrada = 20,
  maxEntrada = 100,
  onOptionSelect,
}: PriceTableProps) {
  const [entradaPercent, setEntradaPercent] = useState(minEntrada);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Motion value for immediate thumb position (0-100 representing thumb position %)
  const thumbX = useMotionValue(0);

  // Transform thumb position to percentage for the filled bar
  const filledWidth = useTransform(thumbX, [0, 100], ['0%', '100%']);

  // Calculate values based on entrada percentage
  const entradaValue = Math.round((totalPrice * entradaPercent) / 100);
  const remainingValue = totalPrice - entradaValue;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate installment value for each option
  const getInstallmentValue = (installments: number) => {
    if (installments === 1) return remainingValue;
    return Math.round(remainingValue / installments);
  };

  // Convert entrada percent to thumb position (0-100)
  const percentToThumbPos = (percent: number): number => {
    return ((percent - minEntrada) / (maxEntrada - minEntrada)) * 100;
  };

  // Initialize thumb position
  useEffect(() => {
    thumbX.set(percentToThumbPos(entradaPercent));
  }, []);

  // Setup global pointer event listeners
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const thumbPos = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));

      // Update motion value immediately (no React re-render)
      thumbX.set(thumbPos);

      // Calculate and update the actual percent for display
      const newPercent = Math.round(minEntrada + (thumbPos / 100) * (maxEntrada - minEntrada));
      setEntradaPercent(Math.max(minEntrada, Math.min(maxEntrada, newPercent)));
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [minEntrada, maxEntrada, thumbX]);

  // Handle pointer down on thumb or track
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);

    // Immediately move to clicked position
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const thumbPos = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));

      thumbX.set(thumbPos);

      const newPercent = Math.round(minEntrada + (thumbPos / 100) * (maxEntrada - minEntrada));
      setEntradaPercent(Math.max(minEntrada, Math.min(maxEntrada, newPercent)));
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: PaymentOption) => {
    setSelectedOption(option.id);
    onOptionSelect?.(option, entradaPercent, entradaValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="glass-card w-full max-w-sm rounded-3xl p-5 sm:p-6 overflow-hidden"
    >
      {/* Header with Total */}
      <div className="text-center mb-6">
        <p className="text-sm text-[var(--text-secondary)] dark:text-white/60 mb-1">
          Valor Total do Imóvel
        </p>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] dark:text-white">
          {formatCurrency(totalPrice)}
        </h2>
      </div>

      {/* Entrada Slider Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[var(--text-primary)] dark:text-white">
            Entrada
          </span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-lg font-bold transition-colors",
              entradaPercent === 100
                ? "text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]"
                : "text-[var(--orange-primary-light)] dark:text-[var(--orange-primary-dark)]"
            )}>
              {entradaPercent}%
            </span>
            <span className="text-sm text-[var(--text-secondary)] dark:text-white/60">
              ({formatCurrency(entradaValue)})
            </span>
          </div>
        </div>

        {/* Slider Track */}
        <div
          ref={sliderRef}
          onPointerDown={handlePointerDown}
          className="relative h-10 flex items-center cursor-pointer touch-none"
        >
          {/* Background Track */}
          <div className="absolute inset-x-0 h-2 rounded-full bg-gray-200 dark:bg-white/10" />

          {/* Filled Track - uses motion value directly */}
          <motion.div
            className={cn(
              "absolute left-0 h-2 rounded-full",
              entradaPercent === 100
                ? "bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]"
                : "bg-gradient-to-r from-[var(--orange-primary-light)] to-[var(--orange-secondary)] dark:from-[var(--orange-primary-dark)] dark:to-[var(--orange-secondary)]"
            )}
            style={{ width: filledWidth }}
          />

          {/* Percentage Markers */}
          <div className="absolute inset-x-0 flex justify-between px-1 pointer-events-none">
            {[20, 40, 60, 80, 100].map((mark) => (
              <div
                key={mark}
                className={cn(
                  "w-1 h-1 rounded-full transition-colors",
                  mark <= entradaPercent
                    ? "bg-white/80"
                    : "bg-gray-400 dark:bg-white/20"
                )}
              />
            ))}
          </div>

          {/* Draggable Thumb - uses motion value directly */}
          <motion.div
            className={cn(
              "absolute h-7 w-7 rounded-full cursor-grab active:cursor-grabbing",
              "flex items-center justify-center",
              "bg-white shadow-lg",
              "border-2",
              entradaPercent === 100
                ? "border-[var(--green-primary-light)] dark:border-[var(--green-primary-dark)]"
                : "border-[var(--orange-primary-light)] dark:border-[var(--orange-primary-dark)]",
              isDragging && "scale-110 shadow-xl"
            )}
            style={{
              left: useTransform(thumbX, (v) => `calc(${v}% - 14px)`),
            }}
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              entradaPercent === 100
                ? "bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]"
                : "bg-[var(--orange-primary-light)] dark:bg-[var(--orange-primary-dark)]"
            )} />
          </motion.div>
        </div>

        {/* Min/Max Labels */}
        <div className="flex justify-between mt-1 text-[10px] text-[var(--text-muted)] dark:text-white/30">
          <span>{minEntrada}%</span>
          <span>{maxEntrada}%</span>
        </div>
      </div>

      {/* Remaining Value Display */}
      {entradaPercent < 100 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 rounded-2xl bg-white/5 dark:bg-white/5 text-center"
        >
          <p className="text-xs text-[var(--text-muted)] dark:text-white/40 mb-0.5">
            Valor a Financiar
          </p>
          <p className="text-xl font-bold text-[var(--text-primary)] dark:text-white">
            {formatCurrency(remainingValue)}
          </p>
        </motion.div>
      )}

      {/* Payment Options */}
      {entradaPercent < 100 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--text-muted)] dark:text-white/40 uppercase tracking-wide mb-3">
            Opções de Parcelamento
          </p>

          {PAYMENT_OPTIONS.filter(opt => opt.installments > 1).map((option, index) => {
            const installmentValue = getInstallmentValue(option.installments);
            const isSelected = selectedOption === option.id;

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200',
                  'active:scale-[0.98]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green-primary-dark)]',
                  isSelected
                    ? 'bg-[var(--green-primary-light)]/15 dark:bg-[var(--green-primary-dark)]/15 border-2 border-[var(--green-primary-light)] dark:border-[var(--green-primary-dark)]'
                    : 'bg-white/5 dark:bg-white/5 border-2 border-transparent hover:bg-white/10 dark:hover:bg-white/10'
                )}
              >
                <div className="text-left">
                  <p className={cn(
                    'font-semibold',
                    isSelected
                      ? 'text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]'
                      : 'text-[var(--text-primary)] dark:text-white'
                  )}>
                    {option.method}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] dark:text-white/40">
                    {option.installments}x de
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'text-lg font-bold',
                    isSelected
                      ? 'text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]'
                      : 'text-[var(--text-primary)] dark:text-white'
                  )}>
                    {formatCurrency(installmentValue)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] dark:text-white/40">
                    /{option.frequency}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 rounded-2xl bg-[var(--green-primary-light)]/15 dark:bg-[var(--green-primary-dark)]/15 border-2 border-[var(--green-primary-light)] dark:border-[var(--green-primary-dark)]"
        >
          <p className="text-sm font-medium text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)] mb-1">
            Pagamento À Vista
          </p>
          <p className="text-2xl font-bold text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]">
            {formatCurrency(totalPrice)}
          </p>
          <p className="text-xs text-[var(--text-muted)] dark:text-white/40 mt-1">
            Sem juros ou parcelas
          </p>
        </motion.div>
      )}

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-[10px] text-center text-[var(--text-muted)] dark:text-white/30"
      >
        * Valores sujeitos a aprovação de crédito
      </motion.p>
    </motion.div>
  );
}
