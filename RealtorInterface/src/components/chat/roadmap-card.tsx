import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Building2,
  DoorOpen,
  ChefHat,
  Bed,
  Trees,
  Settings,
  Handshake,
  Check,
  Circle,
  Clock,
  Play,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoteiroStep, ROTEIRO_DATA } from '@/lib/types';

interface RoadmapCardProps {
  steps?: RoteiroStep[];
  showVRButton?: boolean;
  onStepClick?: (step: RoteiroStep) => void;
  onVRClick?: () => void;
}

// Icon mapping for step types
const iconMap = {
  'user-check': UserCheck,
  'building': Building2,
  'door-open': DoorOpen,
  'chef-hat': ChefHat,
  'bed': Bed,
  'trees': Trees,
  'settings': Settings,
  'handshake': Handshake,
};

export function RoadmapCard({
  steps = ROTEIRO_DATA,
  showVRButton = false,
  onStepClick,
  onVRClick,
}: RoadmapCardProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
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
      className="glass-card w-full max-w-sm rounded-3xl p-5 sm:p-6"
    >
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] dark:text-white">
          Roteiro de Apresentação
        </h3>
        <p className="text-sm text-[var(--text-secondary)] dark:text-white/60 mt-1">
          Guia para apresentar o imóvel
        </p>
      </div>

      {/* Steps Container */}
      <div className="relative space-y-1">
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
          const isExpanded = expandedStep === step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.06,
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            >
              <button
                onClick={() => {
                  toggleStep(step.id);
                  onStepClick?.(step);
                }}
                className={cn(
                  'relative flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-all duration-200',
                  'hover:bg-white/10 dark:hover:bg-white/5 active:scale-[0.99]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green-primary-dark)]',
                  isExpanded && 'bg-white/5 dark:bg-white/5'
                )}
              >
                {/* Status Indicator */}
                <div
                  className={cn(
                    'relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
                    isCompleted && [
                      'border-[var(--green-primary-light)] dark:border-[var(--green-primary-dark)]',
                      'bg-[var(--green-primary-light)] dark:bg-[var(--green-primary-dark)]',
                      'dark:shadow-[0_0_15px_rgba(0,255,136,0.3)]',
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
                      className="h-4 w-4 text-white dark:text-black"
                      strokeWidth={3}
                    />
                  ) : isCurrent ? (
                    <Circle
                      className="h-3 w-3 fill-[var(--orange-primary-light)] dark:fill-[var(--orange-primary-dark)] text-[var(--orange-primary-light)] dark:text-[var(--orange-primary-dark)]"
                      strokeWidth={2}
                    />
                  ) : (
                    <Clock
                      className="h-3.5 w-3.5 text-gray-400 dark:text-white/30"
                      strokeWidth={2}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
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
                        {step.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {step.duration && (
                        <span className="text-[10px] font-medium text-[var(--text-muted)] dark:text-white/30 bg-white/10 dark:bg-white/5 rounded-full px-1.5 py-0.5">
                          {step.duration}
                        </span>
                      )}
                      {step.details && step.details.length > 0 && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-white/30" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <p
                    className={cn(
                      'text-xs mt-0.5 truncate',
                      isCompleted && 'text-[var(--green-primary-light)]/70 dark:text-[var(--green-primary-dark)]/70',
                      isCurrent && 'text-[var(--text-secondary)] dark:text-white/60',
                      isUpcoming && 'text-gray-400 dark:text-white/30'
                    )}
                  >
                    {step.description}
                  </p>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {isExpanded && step.details && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 space-y-1 overflow-hidden"
                      >
                        {step.details.map((detail, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn(
                              'flex items-start gap-2 text-xs',
                              isCompleted && 'text-[var(--green-primary-light)]/80 dark:text-[var(--green-primary-dark)]/80',
                              isCurrent && 'text-[var(--text-secondary)] dark:text-white/70',
                              isUpcoming && 'text-gray-400 dark:text-white/40'
                            )}
                          >
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-current flex-shrink-0" />
                            <span>{detail}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Current Badge */}
                {isCurrent && (
                  <span className="flex-shrink-0 rounded-full bg-[var(--orange-primary-light)]/10 dark:bg-[var(--orange-primary-dark)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--orange-primary-light)] dark:text-[var(--orange-primary-dark)]">
                    Atual
                  </span>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* VR Tour Button */}
      {showVRButton && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: steps.length * 0.06 + 0.1 }}
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
