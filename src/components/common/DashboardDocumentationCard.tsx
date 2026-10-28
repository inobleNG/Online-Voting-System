import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  FileText,
  X
} from 'lucide-react';
import { UserRole } from '../../types';
import { ROLE_DOCS } from './RoleDocumentationModal';

interface DashboardDocumentationCardProps {
  role: UserRole | 'spo';
  onOpenFullManual: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardDocumentationCard: React.FC<DashboardDocumentationCardProps> = ({
  role,
  onOpenFullManual,
  onNavigateTab,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const doc = ROLE_DOCS[role] || ROLE_DOCS.voter;
  const currentStep = doc.steps[activeStepIndex] || doc.steps[0];

  if (isDismissed) {
    return (
      <div className="flex items-center justify-between py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#008751]" />
          <span>Need guidance? Step-by-step documentation is available for your role.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsDismissed(false);
              setIsExpanded(true);
            }}
            className="text-[#008751] hover:underline font-semibold cursor-pointer"
          >
            Show Guide
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={onOpenFullManual}
            className="text-slate-700 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Full Manual
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 text-slate-900 transition-all">
      {/* Sleek Compact Header Bar */}
      <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#008751] border border-emerald-200">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">
                {doc.title}
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${doc.badgeColor}`}>
                {doc.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Step-by-step instructions to carry out your tasks from start to finish.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Steps' : 'View Quick Guide'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onOpenFullManual}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full User Manual</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Minimize guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Step-by-Step Walkthrough */}
      {isExpanded && (
        <div className="p-5 space-y-4">
          {/* Step Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {doc.steps.map((st, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs shrink-0 border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#008751] bg-[#008751] text-white font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {st.step}
                  </span>
                  <span className="truncate">{st.title}</span>
                </button>
              );
            })}
          </div>

          {/* Current Step Instruction Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#008751] text-white text-xs font-mono font-bold">
                  {currentStep.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Step {currentStep.step}: {currentStep.title}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-medium">
                Step {currentStep.step} of {doc.steps.length}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {currentStep.shortDesc}
            </p>

            {/* Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentStep.details.map((dt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#008751] shrink-0 mt-0.5" />
                  <span className="leading-snug">{dt}</span>
                </div>
              ))}
            </div>

            {/* Step Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
              >
                ← Previous Step
              </button>

              <div className="flex items-center gap-2">
                {currentStep.actionTab && onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab(currentStep.actionTab!)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>{currentStep.actionLabel || 'Go to Task'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  type="button"
                  disabled={activeStepIndex === doc.steps.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(doc.steps.length - 1, prev + 1))}
                  className="text-xs font-semibold text-[#008751] hover:text-[#007043] disabled:opacity-40 cursor-pointer"
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
