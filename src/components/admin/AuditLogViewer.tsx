import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle2,
  FileCheck2,
  Download,
  QrCode,
  Layers
} from 'lucide-react';
import { useElection } from '../../context/ElectionContext';
import { generateAuditLogPDF } from '../../lib/pdfGenerator';
import { NigeriaFlag } from '../common/NigeriaCrest';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs, isChainValid, verifyChainIntegrity, addAuditLog, verifyReceiptById } = useElection();

  const [searchTerm, setSearchTerm] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Quick Receipt Lookup inside Audit view
  const [receiptLookupCode, setReceiptLookupCode] = useState('');
  const [receiptResult, setReceiptResult] = useState<{ found: boolean; details?: any } | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    return (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    setVerificationFeedback(null);
    await new Promise((r) => setTimeout(r, 400));
    const valid = await verifyChainIntegrity();
    setIsVerifying(false);
    if (valid) {
      setVerificationFeedback(
        `SUCCESS: Verified ${auditLogs.length} cryptographic blocks. SHA-256 hash pointers are 100% intact. Zero tampering detected.`
      );
    } else {
      setVerificationFeedback('ALERT: Cryptographic hash discrepancy detected in audit block sequence!');
    }
  };

  const handleLookupReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptLookupCode.trim()) return;
    const res = verifyReceiptById(receiptLookupCode.trim());
    if (res) {
      setReceiptResult({ found: true, details: res });
    } else {
      setReceiptResult({ found: false });
    }
  };

  const handleSimulateTamperTest = async () => {
    await addAuditLog(
      'INTEGRITY_CHECK',
      'SECURITY',
      'Automated cryptographic block consistency verification scan performed by Auditor.',
      'info'
    );
  };

  return (
    <div className="space-y-6 text-[#202522] max-w-5xl mx-auto py-2">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <NigeriaFlag width={22} height={14} />
            <span className="text-xs font-bold uppercase tracking-wider text-[#168447]">
              Independent Audit &amp; Observer Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202522] tracking-tight">
            Cryptographic Audit Ledger
          </h1>
          <p className="text-sm text-[#68716B] mt-1">
            Independent verification of SHA-256 tamper-evident vote blocks and administrative events
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => generateAuditLogPDF(auditLogs)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E3E8E4] bg-white hover:bg-[#F6F7F6] text-xs font-bold text-[#202522] cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-[#168447]" />
            <span>Export Audit PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Verification Action Card */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E8E4] pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#68716B]">
              Cryptographic Blockchain Status
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#168447] mt-0.5 flex items-center gap-2">
              <CheckCircle2 className="w-7 h-7 text-[#168447]" />
              <span>{isChainValid ? 'SHA-256 Ledger Sealed' : 'Ledger Anomaly'}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#68716B] mt-1">
              Total Recorded Blocks: <strong className="text-[#202522]">{auditLogs.length} blocks chained</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSimulateTamperTest}
              className="px-4 py-2.5 rounded-lg border border-[#E3E8E4] bg-[#F6F7F6] hover:bg-white text-xs font-bold text-[#202522] transition-colors cursor-pointer"
            >
              + Append Test Block
            </button>
            <button
              type="button"
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-lg bg-[#168447] hover:bg-[#116B39] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Chain Integrity'}</span>
            </button>
          </div>
        </div>

        {verificationFeedback && (
          <div className="p-4 rounded-lg bg-[#F1F7F2] border border-[#E3E8E4] text-[#168447] text-xs font-bold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#168447] shrink-0" />
            <span>{verificationFeedback}</span>
          </div>
        )}
      </div>

      {/* 3. Search and Audit Table */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E8E4] pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#202522]">
              Tamper-Evident Chronological Ledger
            </h2>
            <p className="text-xs text-[#68716B] mt-0.5">
              Each block cryptographically encapsulates the SHA-256 hash of its predecessor
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#68716B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search action, actor, or hash..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E3E8E4] bg-white text-xs text-[#202522] placeholder:text-[#68716B] focus:border-[#168447] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E3E8E4] text-[#68716B] uppercase font-bold text-[11px]">
                <th className="py-3 px-3">Height</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Actor</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Current Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8E4] font-mono">
              {filteredLogs.slice(0, 15).map((log, index) => (
                <tr key={log.id || index} className="hover:bg-[#F6F7F6] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#168447]">
                    #{auditLogs.length - index}
                  </td>
                  <td className="py-3 px-3 font-bold font-sans text-[#202522]">
                    {log.action}
                  </td>
                  <td className="py-3 px-3 font-sans text-[#68716B]">
                    {log.actor_name}
                  </td>
                  <td className="py-3 px-3 text-[#68716B] text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 text-[#168447] font-mono text-[11px] truncate max-w-[200px]" title={log.hash}>
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
