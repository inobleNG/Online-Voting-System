import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'blue' | 'emerald' | 'purple' | 'amber' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'blue',
}) => {
  const iconVariants = {
    blue: 'bg-[#E8F5EE] text-[#008751] border-[#C2E0D0]',
    emerald: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    purple: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
    amber: 'bg-[#E8F5EE] text-[#008751] border-[#C2E0D0]',
    slate: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
  };

  return (
    <div className="rounded-xl border border-[#D2E4D9] bg-[#FFFFFF] p-5 relative overflow-hidden transition-colors hover:border-[#008751]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00683E]">
          {title}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${iconVariants[variant]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-mono font-bold tracking-tight text-[#0F291E]">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-mono font-semibold ${
              trend.isPositive ? 'text-[#047857]' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-[#4A6356]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

