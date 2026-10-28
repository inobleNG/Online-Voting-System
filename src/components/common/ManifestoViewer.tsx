import React, { useRef, useState } from 'react';
import {
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  FileCheck,
  Building2,
  GraduationCap,
  TrendingUp,
  Cpu,
  HeartPulse
} from 'lucide-react';
import { Candidate, Position } from '../../types';
import { jsPDF } from 'jspdf';
import { NigeriaCrest } from './NigeriaCrest';

interface ManifestoViewerProps {
  candidate: Candidate;
  position?: Position;
  allowUpload?: boolean;
  onManifestoChange?: (pdfUrl: string, pdfName: string, text?: string) => void;
}

export const ManifestoViewer: React.FC<ManifestoViewerProps> = ({
  candidate,
  position,
  allowUpload = false,
  onManifestoChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'document' | 'pillars' | 'pdf'>('document');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && onManifestoChange) {
          onManifestoChange(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadManifestoPDF = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner (Nigerian Green)
      doc.setFillColor(0, 135, 81);
      doc.rect(0, 0, 210, 32, 'F');

      // Accent Line (Dark Green)
      doc.setFillColor(0, 90, 54);
      doc.rect(0, 32, 210, 2, 'F');

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFont('times', 'bold');
      doc.setFontSize(15);
      doc.text('FEDERAL REPUBLIC OF NIGERIA', 105, 12, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('INDEPENDENT ELECTORAL & CIVIC BALLOT SYSTEM', 105, 18, { align: 'center' });

      doc.setFontSize(8);
      doc.setTextColor(232, 245, 238);
      doc.text('OFFICIAL CERTIFIED CAMPAIGN MANIFESTO & POLICY COMPACT', 105, 24, { align: 'center' });

      // Candidate Section
      doc.setTextColor(30, 41, 59);
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.text(candidate.full_name.toUpperCase(), 20, 48);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 135, 81);
      doc.text(`CANDIDATE FOR: ${position?.title?.toUpperCase() || 'ELECTED OFFICE'}`, 20, 55);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Political Party: ${candidate.political_party} (${candidate.political_party_acronym || 'NAT'}) | Ballot #${candidate.ballot_number}`, 20, 61);
      if (candidate.running_mate) {
        doc.text(`Running Mate: ${candidate.running_mate}`, 20, 67);
      }

      // Motto Box
      doc.setFillColor(240, 248, 243);
      doc.setDrawColor(0, 135, 81);
      doc.roundedRect(20, 72, 170, 14, 2, 2, 'FD');

      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(0, 90, 54);
      doc.text(`"${candidate.motto}"`, 105, 81, { align: 'center' });

      // Section: Executive Summary & Biography
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 135, 81);
      doc.text('1. EXECUTIVE VISION & CANDIDATE PROFILE', 20, 96);
      doc.line(20, 98, 190, 98);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const bioText = candidate.biography || 
        'Committed to good governance, accountable stewardship, transparency, and inclusive democratic empowerment for all citizens across our constituency.';
      const splitBio = doc.splitTextToSize(bioText, 170);
      doc.text(splitBio, 20, 105);

      // Section: Core Policy Pillars
      let yOffset = 105 + (splitBio.length * 5) + 8;
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 135, 81);
      doc.text('2. STRATEGIC POLICY PILLARS & LEGISLATIVE PLEDGES', 20, yOffset);
      doc.line(20, yOffset + 2, 190, yOffset + 2);

      yOffset += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);

      const points = candidate.manifesto_points && candidate.manifesto_points.length > 0
        ? candidate.manifesto_points
        : [
            'Economic Empowerment, Job Creation & Micro-enterprise Support.',
            'Quality Education, University Infrastructure & Digital Skills Training.',
            'Healthcare Modernization, Primary Care Centers & Community Wellness.',
            'Transparent Financial Governance, Anti-Corruption & Open Data Reporting.',
            'Youth Inclusion, Women Representation & Social Safety Nets.'
          ];

      points.forEach((pt, index) => {
        doc.setFillColor(0, 135, 81);
        doc.circle(24, yOffset - 1, 1.5, 'F');
        doc.setTextColor(30, 41, 59);
        const splitPt = doc.splitTextToSize(pt, 160);
        doc.text(splitPt, 28, yOffset);
        yOffset += Math.max(7, splitPt.length * 5 + 2);
      });

      // Verification Stamp at bottom
      doc.setDrawColor(0, 135, 81);
      doc.setFillColor(232, 245, 238);
      doc.roundedRect(20, 255, 170, 24, 2, 2, 'FD');

      doc.setFont('times', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 90, 54);
      doc.text('INDEPENDENT ELECTORAL COMMISSION - OFFICIAL GAZETTE COMPLIANCE', 24, 262);

      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(74, 99, 86);
      doc.text(`DOCUMENT REF: NGR-MANIF-${candidate.id.toUpperCase()}-2026`, 24, 268);
      doc.text(`SEAL STATUS: AUDITED & CERTIFIED ELIGIBLE CANDIDACY`, 24, 273);

      // Save PDF
      doc.save(`${candidate.full_name.replace(/\s+/g, '_')}_Official_Manifesto_2026.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Manifesto Navigation & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F8FAF8] border border-[#D2E4D9] rounded-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'document'
                ? 'bg-[#008751] text-white'
                : 'text-[#4A6356] hover:text-[#008751] hover:bg-[#E8F5EE]'
            }`}
          >
            Policy Document
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pillars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'pillars'
                ? 'bg-[#008751] text-white'
                : 'text-[#4A6356] hover:text-[#008751] hover:bg-[#E8F5EE]'
            }`}
          >
            5 Strategic Pillars
          </button>
          {candidate.manifesto_pdf_name && (
            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-[#008751] text-white'
                  : 'text-[#4A6356] hover:text-[#008751] hover:bg-[#E8F5EE]'
              }`}
            >
              Uploaded PDF File
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {allowUpload && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5EE] hover:bg-[#D2E4D9] text-[#00683E] border border-[#A3C9B4] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF Manifesto</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={downloadManifestoPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#008751] hover:bg-[#007043] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OFFICIAL PRINTED DOCUMENT VIEW */}
      {activeTab === 'document' && (
        <div className="bg-[#FFFFFF] text-[#0F291E] rounded-xl border border-[#D2E4D9] overflow-hidden">
          {/* Government Ribbon Header */}
          <div className="bg-[#008751] px-6 py-4 text-white text-center relative border-b-2 border-[#005A36]">
            <div className="flex items-center justify-center gap-3">
              <NigeriaCrest size="sm" />
              <div>
                <h3 className="font-crest text-xs uppercase tracking-widest text-white font-bold">
                  Federal Republic of Nigeria
                </h3>
                <p className="text-[11px] font-sans text-white/90">
                  Certified Campaign Manifesto &amp; Governance Compact (2026–2030)
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Title Section */}
            <div className="border-b border-[#E2ECE5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#E8F5EE] text-[#00683E] font-mono font-bold text-[10px] uppercase border border-[#C2E0D0] mb-1">
                  OFFICIAL CANDIDATE COMPACT • BALLOT #{candidate.ballot_number}
                </span>
                <h2 className="font-official text-xl sm:text-2xl font-bold text-[#0F291E]">
                  {candidate.full_name}
                </h2>
                <p className="text-xs text-[#4A6356] font-medium">
                  Candidate for: <strong className="text-[#008751]">{position?.title || 'Elected Office'}</strong> • Party: <strong>{candidate.political_party}</strong>
                </p>
              </div>

              {candidate.photo_url && (
                <img
                  src={candidate.photo_url}
                  alt={candidate.full_name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#008751] shrink-0"
                />
              )}
            </div>

            {/* Slogan Compact */}
            <div className="p-4 bg-[#F0F8F3] border-l-4 border-[#008751] rounded-r-lg">
              <p className="font-official italic text-sm text-[#00683E] font-medium">
                "{candidate.motto}"
              </p>
              {candidate.running_mate && (
                <p className="text-xs text-[#4A6356] mt-1">
                  Nominated Running Mate: <strong className="text-[#0F291E]">{candidate.running_mate}</strong>
                </p>
              )}
            </div>

            {/* Candidate Executive Biography */}
            <div className="space-y-2">
              <h4 className="font-official text-sm font-bold text-[#00683E] uppercase tracking-wide flex items-center gap-2 border-b border-[#D2E4D9] pb-1">
                <BookOpen className="w-4 h-4 text-[#008751]" />
                <span>Executive Summary &amp; Track Record</span>
              </h4>
              <p className="text-xs text-[#334155] leading-relaxed">
                {candidate.biography ||
                  'Dedicated public servant and visionary leader with extensive administrative experience. Committed to ushering in transformative socio-economic progress, meritocratic leadership, and verifiable accountability.'}
              </p>
            </div>

            {/* Key Policy Commitments */}
            <div className="space-y-3">
              <h4 className="font-official text-sm font-bold text-[#00683E] uppercase tracking-wide flex items-center gap-2 border-b border-[#D2E4D9] pb-1">
                <FileCheck className="w-4 h-4 text-[#008751]" />
                <span>Core Legislative &amp; Executive Pledges</span>
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {(candidate.manifesto_points || []).map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-[#F8FAF8] border border-[#D2E4D9] rounded-lg"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#008751] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-[#0F291E] leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Certification Seal */}
            <div className="mt-8 pt-4 border-t border-[#D2E4D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[#4A6356] font-mono">
              <div className="flex items-center gap-2 text-[#008751] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>OFFICIALLY SUBMITTED &amp; GAZETTED</span>
              </div>
              <div className="text-right">
                <span>Ref: NGR-MANIF-{candidate.id.toUpperCase()}-2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5 STRATEGIC PILLARS */}
      {activeTab === 'pillars' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#FFFFFF] border border-[#D2E4D9] rounded-lg space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] border border-[#C2E0D0] flex items-center justify-center text-[#008751]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h5 className="font-crest text-xs font-bold text-[#00683E]">
              Pillar 1: Economic Revitalization &amp; Job Creation
            </h5>
            <p className="text-xs text-[#4A6356] leading-relaxed">
              Targeted low-interest micro-credit grants, vocational training centers, and strategic SME tax relief to empower youths and local entrepreneurs.
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D2E4D9] rounded-lg space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] border border-[#C2E0D0] flex items-center justify-center text-[#008751]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h5 className="font-crest text-xs font-bold text-[#00683E]">
              Pillar 2: Educational Excellence &amp; Technology
            </h5>
            <p className="text-xs text-[#4A6356] leading-relaxed">
              Equipping schools and universities with high-speed fiber internet, modern science laboratories, teacher training, and digital scholarship endowments.
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D2E4D9] rounded-lg space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] border border-[#C2E0D0] flex items-center justify-center text-[#008751]">
              <HeartPulse className="w-4 h-4" />
            </div>
            <h5 className="font-crest text-xs font-bold text-[#00683E]">
              Pillar 3: Universal Healthcare &amp; Wellness
            </h5>
            <p className="text-xs text-[#4A6356] leading-relaxed">
              Renovating primary healthcare centers across all wards, introducing emergency medical response units, and subsidized maternal health services.
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D2E4D9] rounded-lg space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] border border-[#C2E0D0] flex items-center justify-center text-[#008751]">
              <Cpu className="w-4 h-4" />
            </div>
            <h5 className="font-crest text-xs font-bold text-[#00683E]">
              Pillar 4: Digital Governance &amp; Infrastructure
            </h5>
            <p className="text-xs text-[#4A6356] leading-relaxed">
              Transparent procurement portals, continuous road rehabilitation, solar mini-grids for market hubs, and open civic feedback mechanisms.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: UPLOADED PDF FILE STATUS */}
      {activeTab === 'pdf' && candidate.manifesto_pdf_name && (
        <div className="p-6 bg-[#FFFFFF] border border-[#D2E4D9] rounded-lg text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-lg bg-[#E8F5EE] border border-[#C2E0D0] flex items-center justify-center text-[#008751]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F291E]">
              {candidate.manifesto_pdf_name}
            </h4>
            <p className="text-xs text-[#4A6356] mt-0.5">
              Certified Original PDF Document Attached by Candidate Campaign Organization
            </p>
          </div>
          <button
            type="button"
            onClick={downloadManifestoPDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#008751] hover:bg-[#007043] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Attached PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
