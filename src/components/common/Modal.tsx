import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
  icon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  icon,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} overflow-hidden rounded-xl bg-[#FFFFFF] border border-[#D2E4D9] transition-all z-10 my-8 text-[#0F291E]`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2ECE5] px-6 py-4 bg-[#F8FAF8]">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5EE] border border-[#C2E0D0] text-[#008751]">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-base font-crest font-bold text-[#0F291E]">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-[#4A6356] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#E8F5EE] hover:text-[#008751] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto bg-[#FFFFFF]">
          {children}
        </div>
      </div>
    </div>
  );
};

