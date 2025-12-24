import { motion } from 'framer-motion';
import {
  Wallet,
  Search,
  Calendar,
  Handshake,
  FileText,
  Key,
  Check,
  Circle,
  Clock,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoadmapStep, ROADMAP_DATA } from '@/lib/types';

interface RoadmapCardProps {
  steps?: RoadmapStep[];
  showVRButton?: boolean;
  onStepClick?: (step: RoadmapStep) => void;
  onVRClick?: () => void;
}

// Icon mapping for step types
const iconMap = {
  wallet: Wallet,
  search: Search,
  calendar: Calendar,
  handshake: Handshake,
  'file-text': FileText,
  key: Key,
};

export function RoadmapCard({
  steps = ROADMAP_DATA,
  showVRButton = false,
  onStepClick,
  onVRClick,
}: RoadmapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="glass-card w-full max-w-sm rounded-3xl p-5 sm:p-6"
    >
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] dark:text-white">
          Roteiro de Compra
        </h3>
        <p className="text-sm text-[var(--text-secondary)] dark:text-white/60 mt-1">
          Acompanhe seu progresso
        </p>
      </div>

      {/* Steps Container */}
      <div className="relative space-y-1 pl-2">
        {/* Connection Line */}
        <div
          className="absolute left-[1.35rem] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[var(--green-primary-light)] dark:from-[var(--green-primary-dark)] via-[var(--orange-primary-light)] dark:via-[var(--orange-primary-dark)] to-gray-300 dark:to-white/10"
          aria-hidden="true"
        />

        {steps.map((step, index) => {
          const Icon = iconMap[step.icon];
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isUpcoming = step.status === 'upcoming';

          return (
            <motion.button
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.08,
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
              onClick={() => onStepClick?.(step)}
              className={cn(
                'relative flex w-full items-start gap-4 rounded-2xl p-3 text-left transition-all duration-200',
                'hover:bg-white/10 dark:hover:bg-white/5 active:scale-[0.98]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green-primary-dark)]'
              )}
            >
              {/* Status Indicator */}
              <div
                className={cn(
                  'relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  isCompleted && [
                    'border-[var(--green-primary-light)] dark:border-[var(--green-primary-dark)]',
                    'bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]',
                    'dark:shadow-[0_0_20px_rgba(0,255,136,0.4)]',
                  ],
                  isCurrent && [
                    'border-[var(--orange-primary-light)] dark:border-[var(--orange-primary-dark)]',
                    'bg-white/20 dark:bg-white/10',
                    'ring-pulse',
                  ],
                  isUpcoming && [
                    'border-gray-300 dark:border-white/20',
                    'bg-gray-100 dark:bg-black/20',
                  ]
                )}
              >
                {isCompleted ? (
                  <Check
                    className="h-5 w-5 text-white dark:text-black"
                    strokeWidth={3}
                  />
                ) : isCurrent ? (
                  <Circle
                    className="h-4 w-4 fill-[var(--orange-primary-light)] dark:fill-[var(--orange-primary-dark)] text-[var(--orange-primary-light)] dark:text-[var(--orange-primary-dark)]"
                    strokeWidth={2}
                  />
                ) : (
                  <Clock
                    className="h-4 w-4 text-gray-400 dark:text-white/30"
                    strokeWidth={2}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      'h-4 w-4 flex-shrink-0',
                      isCompleted && 'text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]',
                      isCurrent && 'text-[var(--orange-primary-light)] dark:text-[var(--orange-primary-dark)]',
                      isUpcoming && 'text-gray-400 dark:text-white/40'
                    )}
                  />
                  <h4
                    className={cn(
                      'text-sm font-semibold truncate',
                      isCompleted && 'text-[var(--green-primary-light)] dark:text-[var(--green-primary-dark)]',
                      isCurrent && 'text-[var(--text-primary)] dark:text-white',
                      isUpcoming && 'text-gray-500 dark:text-white/50'
                    )}
                  >
                    {step.titlePt}
                  </h4>
                </div>
                <p
                  className={cn(
                    'text-xs mt-0.5 truncate',
                    isCompleted && 'text-[var(--green-primary-light)]/70 dark:text-[var(--green-primary-dark)]/70',
                    isCurrent && 'text-[var(--text-secondary)] dark:text-white/60',
                    isUpcoming && 'text-gray-400 dark:text-white/30'
                  )}
                >
                  {step.descriptionPt}
                </p>
              </div>

              {/* Status Badge */}
              {isCurrent && (
                <span className="flex-shrink-0 rounded-full bg-[var(--orange-primary-light)]/10 dark:bg-[var(--orange-primary-dark)]/20 px-2 py-0.5 text-xs font-medium text-[var(--orange-primary-light)] dark:text-[var(--orange-primary-dark)]">
                  Atual
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* VR Tour Button */}
      {showVRButton && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: steps.length * 0.08 + 0.1 }}
          onClick={onVRClick}
          className="vr-button w-full mt-5 flex items-center justify-center gap-2 rounded-2xl py-3.5 px-4 touch-target"
        >
          <Play className="h-5 w-5" fill="currentColor" />
          <span>Iniciar Tour VR</span>
        </motion.button>
      )}
    </motion.div>
  );
}
