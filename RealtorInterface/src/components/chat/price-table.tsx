import { motion } from 'framer-motion';
import { CreditCard, Percent, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentOption, PRICE_TABLE_DATA } from '@/lib/types';

interface PriceTableProps {
  options?: PaymentOption[];
  onOptionClick?: (option: PaymentOption) => void;
}

export function PriceTable({
  options = PRICE_TABLE_DATA,
  onOptionClick,
}: PriceTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="glass-card w-full max-w-md rounded-3xl p-5 sm:p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]" />
          Tabela de Pagamentos
        </h3>
        <p className="text-sm text-[var(--text-secondary)] dark:text-white/60 mt-1">
          Escolha a melhor opção para você
        </p>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden sm:grid grid-cols-5 gap-2 px-3 py-2 mb-2 text-xs font-medium text-[var(--text-muted)] dark:text-white/40 uppercase tracking-wide">
        <div>Método</div>
        <div className="text-right">Valor/Período</div>
        <div className="text-right">Total</div>
        <div className="text-center">Entrada</div>
        <div className="text-center">Parcelas</div>
      </div>

      {/* Payment Options */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.08,
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            onClick={() => onOptionClick?.(option)}
            className={cn(
              'relative w-full rounded-2xl p-4 text-left transition-all duration-200',
              'hover:bg-white/10 dark:hover:bg-white/5 active:scale-[0.99]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green-primary-dark)]',
              option.highlight
                ? 'bg-[var(--green-primary-light)]/10 dark:bg-[var(--green-primary-dark)]/10 border border-[var(--green-primary-light)] dark:border-[var(--green-primary-dark)]'
                : 'bg-white/5 dark:bg-white/5 border border-transparent'
            )}
          >
            {/* Recommended Badge */}
            {option.highlight && (
              <div className="absolute -top-2 right-3 flex items-center gap-1 rounded-full bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)] px-2 py-0.5 text-xs font-semibold text-white dark:text-black">
                <Check className="h-3 w-3" />
                Recomendado
              </div>
            )}

            {/* Mobile Layout */}
            <div className="sm:hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-base font-semibold',
                  option.highlight
                    ? 'text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]'
                    : 'text-[var(--text-primary)] dark:text-white'
                )}>
                  {option.methodPt}
                </span>
                <span className="text-lg font-bold text-[var(--text-primary)] dark:text-white">
                  {option.totalAmount}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/5 dark:bg-white/5 p-2">
                  <div className="text-xs text-[var(--text-muted)] dark:text-white/40 mb-0.5">
                    Valor
                  </div>
                  <div className="text-sm font-medium text-[var(--text-primary)] dark:text-white">
                    {option.monthlyAmount}
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 dark:bg-white/5 p-2">
                  <div className="text-xs text-[var(--text-muted)] dark:text-white/40 mb-0.5 flex items-center justify-center gap-1">
                    <Percent className="h-3 w-3" /> Entrada
                  </div>
                  <div className="text-sm font-medium text-[var(--text-primary)] dark:text-white">
                    {option.downPaymentPercent}%
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 dark:bg-white/5 p-2">
                  <div className="text-xs text-[var(--text-muted)] dark:text-white/40 mb-0.5 flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3" /> Parcelas
                  </div>
                  <div className="text-sm font-medium text-[var(--text-primary)] dark:text-white">
                    {option.installments}x
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:grid grid-cols-5 gap-2 items-center">
              <div className={cn(
                'font-semibold',
                option.highlight
                  ? 'text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]'
                  : 'text-[var(--text-primary)] dark:text-white'
              )}>
                {option.methodPt}
              </div>
              <div className="text-right font-medium text-[var(--text-primary)] dark:text-white">
                {option.monthlyAmount}
              </div>
              <div className="text-right font-bold text-[var(--text-primary)] dark:text-white">
                {option.totalAmount}
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 dark:bg-white/10 px-2 py-1 text-sm font-medium text-[var(--text-primary)] dark:text-white">
                  <Percent className="h-3 w-3" />
                  {option.downPaymentPercent}%
                </span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 dark:bg-white/10 px-2 py-1 text-sm font-medium text-[var(--text-primary)] dark:text-white">
                  {option.installments}x
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: options.length * 0.08 + 0.1 }}
        className="mt-4 text-xs text-center text-[var(--text-muted)] dark:text-white/40"
      >
        * Valores sujeitos a aprovação de crédito
      </motion.p>
    </motion.div>
  );
}
