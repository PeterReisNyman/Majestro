import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PaymentOption {
  id: string;
  method: string;
  installments: number;
  frequency: string;
}

interface PriceTableProps {
  totalPrice?: number;
  minEntrada?: number; // Minimum down payment percentage
  maxEntrada?: number; // Maximum down payment percentage
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

  // Calculate percentage from pointer position
  const calculatePercent = useCallback((clientX: number) => {
    if (!sliderRef.current) return entradaPercent;

    const rect = sliderRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
    return Math.round(minEntrada + percentage * (maxEntrada - minEntrada));
  }, [minEntrada, maxEntrada, entradaPercent]);

  // Handle pointer move while dragging
  const handlePointerMove = useCallback((e: PointerEvent) => {
    const newPercent = calculatePercent(e.clientX);
    setEntradaPercent(Math.max(minEntrada, Math.min(maxEntrada, newPercent)));
  }, [calculatePercent, minEntrada, maxEntrada]);

  // Handle pointer up - stop dragging
  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  // Handle pointer down on thumb - start dragging
  const handleThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Handle click on slider track
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const newPercent = calculatePercent(e.clientX);
    setEntradaPercent(Math.max(minEntrada, Math.min(maxEntrada, newPercent)));
  };

  // Handle option selection
  const handleOptionSelect = (option: PaymentOption) => {
    setSelectedOption(option.id);
    onOptionSelect?.(option, entradaPercent, entradaValue);
  };

  // Calculate thumb position
  const thumbPosition = ((entradaPercent - minEntrada) / (maxEntrada - minEntrada)) * 100;

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
          onClick={handleSliderClick}
          className="relative h-10 flex items-center cursor-pointer"
        >
          {/* Background Track */}
          <div className="absolute inset-x-0 h-2 rounded-full bg-gray-200 dark:bg-white/10" />

          {/* Filled Track */}
          <motion.div
            className={cn(
              "absolute left-0 h-2 rounded-full transition-colors",
              entradaPercent === 100
                ? "bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]"
                : "bg-gradient-to-r from-[var(--orange-primary-light)] to-[var(--orange-secondary)] dark:from-[var(--orange-primary-dark)] dark:to-[var(--orange-secondary)]"
            )}
            style={{ width: `${thumbPosition}%` }}
          />

          {/* Percentage Markers */}
          <div className="absolute inset-x-0 flex justify-between px-1">
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

          {/* Draggable Thumb */}
          <div
            onPointerDown={handleThumbPointerDown}
            className={cn(
              "absolute h-7 w-7 rounded-full cursor-grab active:cursor-grabbing",
              "flex items-center justify-center",
              "bg-white dark:bg-white shadow-lg",
              "border-2 transition-all duration-75",
              entradaPercent === 100
                ? "border-[var(--green-primary-light)] dark:border-[var(--green-primary-dark)]"
                : "border-[var(--orange-primary-light)] dark:border-[var(--orange-primary-dark)]",
              isDragging && "scale-110 shadow-xl"
            )}
            style={{
              left: `calc(${thumbPosition}% - 14px)`,
              touchAction: 'none',
            }}
          >
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              entradaPercent === 100
                ? "bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]"
                : "bg-[var(--orange-primary-light)] dark:bg-[var(--orange-primary-dark)]"
            )} />
          </div>
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
        // 100% Entrada - À Vista
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
