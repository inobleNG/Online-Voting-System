import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileCheck2
} from 'lucide-react';
import { useElection } from '../../context/ElectionContext';
import { VoteReceipt } from '../../types';
import { QRCodeSvg } from '../common/QRCodeSvg';
import { generateVoterReceiptPDF } from '../../lib/pdfGenerator';

export const VerifyReceiptPortal: React.FC = () => {
  const { receipts, verifyReceiptById } = useElection();

  const [searchHash, setSearchHash] = useState('');
  const [verifiedReceipt, setVerifiedReceipt] = useState<VoteReceipt | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHash.trim()) return;

    const result = verifyReceiptById(searchHash.trim());
    setVerifiedReceipt(result);
    setHasSearched(true);
  };

  const handleQuickSelect = (rcpt: VoteReceipt) => {
    setSearchHash(rcpt.receipt_hash);
    setVerifiedReceipt(rcpt);
    setHasSearched(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#202522] py-2">
      
      {/* Header */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8 text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1F7F2] text-[#168447] border border-[#E3E8E4]">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#168447] bg-[#F1F7F2] border border-[#E3E8E4] px-3 py-1 rounded">
            Federal Republic of Nigeria • Public Verification
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202522] tracking-tight">
          Public Zero-Knowledge Receipt Verification
        </h1>
        <p className="text-sm text-[#68716B] max-w-xl mx-auto leading-relaxed">
          Confirm that your ballot has been immutably included in the national cryptographic ledger without exposing your identity or choices.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="rounded-xl border border-[#E3E8E4] bg-white p-6 sm:p-8 space-y-4">
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="block text-xs font-bold text-[#168447] uppercase tracking-wider">
            Enter Official Receipt Token or SHA-256 Hash
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#68716B]" />
              <input
                type="text"
                required
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder="e.g. VOTE-NG26-89EF-4412 or SHA-256 hash..."
                className="w-full rounded-lg border border-[#E3E8E4] bg-white py-3 pl-10 pr-4 font-mono text-xs sm:text-sm text-[#202522] placeholder:text-[#68716B] focus:border-[#168447] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#168447] hover:bg-[#116B39] px-6 py-3 text-sm font-bold text-white transition-colors cursor-pointer shrink-0"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Verify Receipt</span>
            </button>
          </div>
        </form>

        {/* Quick sample chips */}
        {receipts.length > 0 && (
          <div className="border-t border-[#E3E8E4] pt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68716B] block mb-2">
              Available sample receipts to test:
            </span>
            <div className="flex flex-wrap gap-2">
              {receipts.slice(0, 3).map((r) => (
                <button
                  key={r.receipt_id || r.receipt_hash || r.id}
                  type="button"
                  onClick={() => handleQuickSelect(r)}
                  className="rounded-lg bg-[#F6F7F6] border border-[#E3E8E4] hover:border-[#168447] hover:text-[#168447] hover:bg-[#F1F7F2] px-3 py-1.5 font-mono text-xs text-[#202522] font-semibold transition-colors cursor-pointer"
                >
                  {r.receipt_id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verification Result Display */}
      {hasSearched && (
        <div>
          {verifiedReceipt ? (
            <div className="rounded-xl border border-[#E3E8E4] bg-white p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E8E4] pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F1F7F2] border border-[#E3E8E4] text-[#168447]">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#202522]">
                      Receipt Cryptographically Valid
                    </h3>
                    <p className="text-xs sm:text-sm text-[#68716B]">
                      Ballot verified on immutable SHA-256 Merkle block tree.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => generateVoterReceiptPDF(verifiedReceipt)}
                  className="flex items-center gap-2 rounded-lg bg-[#168447] hover:bg-[#116B39] px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Certified PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="rounded-lg border border-[#E3E8E4] bg-[#F6F7F6] p-4 space-y-1">
                  <span className="text-[#68716B] text-[11px] uppercase tracking-wider block font-bold">RECEIPT TOKEN ID</span>
                  <span className="font-bold text-sm text-[#202522]">{verifiedReceipt.receipt_id}</span>
                </div>
                <div className="rounded-lg border border-[#E3E8E4] bg-[#F6F7F6] p-4 space-y-1">
                  <span className="text-[#68716B] text-[11px] uppercase tracking-wider block font-bold">ELECTION JURISDICTION</span>
                  <span className="font-bold text-sm text-[#168447] truncate block">{verifiedReceipt.election_title}</span>
                </div>
                <div className="rounded-lg border border-[#E3E8E4] bg-[#F6F7F6] p-4 space-y-1">
                  <span className="text-[#68716B] text-[11px] uppercase tracking-wider block font-bold">BLOCK SEQUENCE HEIGHT</span>
                  <span className="font-bold text-sm text-[#168447]">Block #{verifiedReceipt.block_height}</span>
                </div>
                <div className="rounded-lg border border-[#E3E8E4] bg-[#F6F7F6] p-4 space-y-1">
                  <span className="text-[#68716B] text-[11px] uppercase tracking-wider block font-bold">TIMESTAMPTZ SEAL</span>
                  <span className="text-xs text-[#202522]">{new Date(verifiedReceipt.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="rounded-lg border border-[#E3E8E4] bg-[#F6F7F6] p-5 flex flex-col sm:flex-row items-center gap-4 font-mono text-xs">
                <div className="bg-white p-2 rounded-lg shrink-0 border border-[#E3E8E4]">
                  <QRCodeSvg value={verifiedReceipt.receipt_hash} size={84} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[11px] text-[#168447] uppercase tracking-wider block font-bold">
                    SHA-256 Merkle Receipt Hash:
                  </span>
                  <p className="text-xs text-[#202522] break-all leading-relaxed font-bold">
                    {verifiedReceipt.receipt_hash}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center space-y-2">
              <AlertTriangle className="h-8 w-8 text-rose-600 mx-auto" />
              <h3 className="text-base font-bold text-rose-900">
                Hash Not Found on National Ledger
              </h3>
              <p className="text-xs text-rose-800 max-w-md mx-auto">
                No matching cryptographic receipt exists for this identifier. Please verify the code or confirm all hexadecimal characters were typed correctly.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
