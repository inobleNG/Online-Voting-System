import React, { useState } from 'react';
import { Database, Copy, Check, ShieldCheck, Code, Server, Layers } from 'lucide-react';
import { COMPLETE_DATABASE_SCHEMA_SQL } from '../../lib/databaseSchemaSql';

export const DatabaseSchemaViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(COMPLETE_DATABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              DATABASE DDL &amp; INSTITUTIONAL SECURITY
            </span>
            <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#008751]">
              SUPABASE / POSTGRES READY
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">
            PostgreSQL Relational Schema &amp; Security Architecture
          </h2>
          <p className="text-xs text-slate-500">
            Production schema with Row Level Security (RLS), atomic stored procedures, and cryptographic hash triggers
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Migration DDL'}</span>
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-[#008751]" />
            <span>Row Level Security (RLS)</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Granular read/write security policies strictly enforcing Role-Based Access Controls for Administrators, Officers, and Verified Electors.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Server className="h-4 w-4 text-[#008751]" />
            <span>Atomic <code className="text-[#008751] font-mono font-semibold">cast_ballot()</code> RPC</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ACID transaction stored procedure that validates PIN, generates anonymous tokens, records votes, and locks double-voting atomically.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Layers className="h-4 w-4 text-[#008751]" />
            <span>Cryptographic Merkle Chains</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Audit logs linked via SHA-256 previous-hash pointers for mathematical non-repudiation and tamper-evidence.
          </p>
        </div>
      </div>

      {/* Code Display Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-slate-700" />
            <span className="text-slate-900 font-semibold font-mono">schema.sql — PostgreSQL DDL Engine</span>
          </div>
          <span className="text-[#008751] font-semibold">100% Production Ready</span>
        </div>
        <pre className="overflow-x-auto p-4 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-200 leading-relaxed max-h-[600px] overflow-y-auto">
          {COMPLETE_DATABASE_SCHEMA_SQL}
        </pre>
      </div>

    </div>
  );
};
