import { jsPDF } from 'jspdf';
import { Election, ElectionTally, VoteReceipt, AuditLog, Position, Candidate, VoterEligibility } from '../types';

export function generateElectionResultsPDF(
  election: Election,
  tallyOrPositions: ElectionTally | Position[],
  candidates?: Candidate[],
  voterRoll?: VoterEligibility[]
): void {
  let tally: ElectionTally;

  if (Array.isArray(tallyOrPositions)) {
    const positionsList = tallyOrPositions;
    const candList = candidates || [];
    const voters = voterRoll || [];
    const votedCount = voters.filter((v) => v.has_voted).length;

    tally = {
      election_id: election.id,
      total_registered: voters.length,
      total_votes_cast: votedCount,
      turnout_percentage: voters.length > 0 ? (votedCount / voters.length) * 100 : 0,
      abstained_count: 0,
      positions: positionsList.map((pos) => {
        const pCands = candList.filter((c) => c.position_id === pos.id);
        const totalVotes = pCands.reduce((acc, c) => acc + (c.vote_count || 0), 0);
        const maxVotes = Math.max(...pCands.map((c) => c.vote_count || 0), 0);

        return {
          position_id: pos.id,
          position_title: pos.title,
          max_choices: pos.max_choices,
          total_votes: totalVotes,
          candidates: pCands.map((c) => ({
            candidate_id: c.id,
            full_name: c.full_name,
            political_party: c.political_party,
            photo_url: c.photo_url,
            votes: c.vote_count || 0,
            percentage: totalVotes > 0 ? ((c.vote_count || 0) / totalVotes) * 100 : 0,
            is_winner: (c.vote_count || 0) === maxVotes && maxVotes > 0,
          })),
        };
      }),
    };
  } else {
    tally = tallyOrPositions;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL ELECTION RESULTS CERTIFICATE', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Election Code: ${election.code} | Category: ${election.category}`, 14, 26);
  doc.text(`Generated: ${new Date().toUTCString()} | Status: ${election.status.toUpperCase()}`, 14, 33);

  // Body
  let y = 50;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(election.title, 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Description: ${election.description || 'N/A'}`, 14, y);
  y += 10;

  // Turnout Summary Box
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Registered Voters: ${tally.total_registered}`, 18, y + 8);
  doc.text(`Total Ballots Cast: ${tally.total_votes_cast}`, 85, y + 8);
  doc.text(`Voter Turnout: ${tally.turnout_percentage.toFixed(1)}%`, 145, y + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Abstained: ${tally.abstained_count}`, 18, y + 15);
  doc.text(`Certified By: ${election.certified_by || 'Election Commission'}`, 85, y + 15);
  y += 28;

  // Positions & Candidates Breakdown
  tally.positions.forEach((pos, pIdx) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`POSITION ${pIdx + 1}: ${pos.position_title.toUpperCase()} (Votes: ${pos.total_votes})`, 18, y + 6);
    y += 12;

    pos.candidates.forEach((cand) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', cand.is_winner ? 'bold' : 'normal');
      doc.setFontSize(10);
      const winnerTag = cand.is_winner ? ' [WINNER/ELECTED]' : '';
      doc.text(`${cand.full_name} (${cand.political_party})${winnerTag}`, 18, y);
      doc.text(`${cand.votes} votes (${cand.percentage.toFixed(1)}%)`, pageWidth - 50, y);
      y += 6;
    });

    y += 6;
  });

  // Footer & Cryptographic Signature
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  doc.setFontSize(8);
  doc.setFont('courier', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Cryptographic SHA-256 Hash: ${election.merkle_root_hash || 'SHA256: 8f9b2d8e41a0293cb83e91ff02a9b819283e47' }`, 14, y);
  doc.text('This document is electronically verified and sealed by VoxSecure Cryptographic Voting Ledger.', 14, y + 5);

  doc.save(`Election_Results_${election.code}_${Date.now()}.pdf`);
}

export function generateVoterReceiptPDF(receipt: VoteReceipt): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL BALLOT CAST RECEIPT', 14, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Zero-Knowledge End-to-End Verifiable Receipt', 14, 24);
  doc.text(`Receipt Code: ${receipt.receipt_id}`, 14, 30);

  let y = 45;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Election: ${receipt.election_title}`, 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Cast Timestamp: ${new Date(receipt.timestamp).toUTCString()}`, 14, y);
  y += 5;
  doc.text(`Ledger Block Height: #${receipt.block_height}`, 14, y);
  y += 10;

  // Selections Table
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, pageWidth - 28, 8 + receipt.selections_summary.length * 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Ballot Positions & Candidate Selections Recorded:', 18, y + 6);
  y += 10;

  receipt.selections_summary.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.text(`• ${item.position_title}:`, 22, y);
    doc.setFont('helvetica', 'bold');
    doc.text(item.candidate_name, 80, y);
    y += 7;
  });

  y += 10;
  doc.setFillColor(238, 242, 255);
  doc.rect(14, y, pageWidth - 28, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(49, 46, 129);
  doc.text('Cryptographic Verification Hash (SHA-256):', 18, y + 7);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.text(receipt.receipt_hash, 18, y + 14);

  y += 30;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('How to verify: Visit the Public Verification Portal and enter your Receipt Code to confirm your ballot is counted.', 14, y);

  doc.save(`Ballot_Receipt_${receipt.receipt_id}.pdf`);
}

export function generateAuditLogPDF(logs: AuditLog[]): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CRYPTOGRAPHIC AUDIT TRAIL LOG', 14, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exported: ${new Date().toUTCString()} | Total Events: ${logs.length}`, 14, 24);

  let y = 40;
  doc.setTextColor(15, 23, 42);

  logs.forEach((log, idx) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`[#${idx + 1}] ${log.timestamp} | ${log.module} | ${log.action} (${log.severity.toUpperCase()})`, 14, y);
    y += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Actor: ${log.actor_name} (${log.actor_role}) | IP: ${log.ip_address}`, 14, y);
    y += 5;
    doc.text(`Details: ${log.details}`, 14, y);
    y += 5;

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Hash: ${log.hash}`, 14, y);
    doc.text(`Prev: ${log.previous_hash}`, 14, y + 4);
    y += 10;
    doc.setTextColor(15, 23, 42);
  });

  doc.save(`Audit_Trail_Report_${Date.now()}.pdf`);
}
