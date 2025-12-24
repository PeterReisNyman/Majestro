import { motion } from 'framer-motion';
import { Home, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--green-primary-light)]/10 dark:bg-[var(--green-primary-dark)]/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--orange-primary-light)]/10 dark:bg-[var(--orange-primary-dark)]/12 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 glass-card rounded-3xl p-8 max-w-md w-full text-center"
      >
        {/* Icon */}
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[var(--orange-primary-light)]/10 dark:bg-[var(--orange-primary-dark)]/20 mx-auto mb-6">
          <MessageSquare className="h-10 w-10 text-[var(--orange-primary-light)] dark:text-[var(--orange-primary-dark)]" />
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-[var(--text-primary)] dark:text-white mb-2">
          404
        </h1>

        {/* Message */}
        <p className="text-lg text-[var(--text-secondary)] dark:text-white/60 mb-6">
          Página não encontrada
        </p>

        <p className="text-sm text-[var(--text-muted)] dark:text-white/40 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        {/* Back to Home Button */}
        <Link href="/">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 btn-primary rounded-full px-6 py-3 font-semibold"
          >
            <Home className="h-5 w-5" />
            Voltar ao Início
          </motion.a>
        </Link>
      </motion.div>
    </div>
  );
}
