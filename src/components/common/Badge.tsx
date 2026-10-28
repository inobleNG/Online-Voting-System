import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'blue' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-[#E8F5EE] text-[#00683E] border-[#C2E0D0]',
    success: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    warning: 'bg-[#F0F8F3] text-[#00683E] border-[#A3C9B4]',
    danger: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    purple: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
    blue: 'bg-[#E8F5EE] text-[#008751] border-[#008751]/30',
    neutral: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
  };

  const dotColors = {
    default: 'bg-[#008751]',
    success: 'bg-emerald-500',
    warning: 'bg-[#008751]',
    danger: 'bg-rose-500',
    purple: 'bg-purple-500',
    blue: 'bg-[#008751]',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] font-mono font-medium',
    md: 'px-2.5 py-1 text-xs font-mono font-medium',
    lg: 'px-3 py-1.5 text-xs font-mono font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

