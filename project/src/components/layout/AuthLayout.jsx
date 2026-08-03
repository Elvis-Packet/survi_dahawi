import { motion } from 'framer-motion';
import { Hexagon, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function AuthLayout({ children, side = 'left' }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-navy-950">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy-900 p-12 text-white lg:flex dark:bg-navy-950">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Hexagon size={18} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">SurvitechDahawi</p>
            <p className="text-[10px] uppercase tracking-wider text-white/60">Fintech Suite</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h2 className="text-3xl font-bold leading-tight">Task & Performance Management for modern fintech teams.</h2>
          <p className="mt-4 max-w-md text-white/70">Plan weekly work, track performance, and give leadership complete visibility — all in one clean, professional workspace.</p>
          <div className="mt-8 space-y-4">
            <Feature icon={TrendingUp} title="Performance analytics" desc="Track completion, on-time delivery, and team trends." />
            <Feature icon={ShieldCheck} title="Compliance-first" desc="Audit logs, role-based access, and verification workflows." />
            <Feature icon={Users} title="Role-based workspaces" desc="Tailored views for staff, managers, and executives." />
          </div>
        </motion.div>

        <p className="relative text-xs text-white/40">© 2026 SurvitechDahawi. Internal use only.</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-white/60">{desc}</p>
      </div>
    </div>
  );
}
