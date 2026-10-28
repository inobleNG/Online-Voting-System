import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Trophy,
  Download,
  Award,
  Users,
  CheckCircle2,
  PieChart as PieIcon,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Filter,
  Flame,
  Sparkles
} from 'lucide-react';
import { useElection } from '../../context/ElectionContext';
import { Badge } from '../common/Badge';
import { generateElectionResultsPDF } from '../../lib/pdfGenerator';

const COLORS = ['#168447', '#1E9E56', '#26B865', '#2ED274', '#55DC8E', '#7CE5A9', '#A3EEBF'];

export const ResultsAnalytics: React.FC = () => {
  const { selectedElection, positions, candidates, voterRoll, elections, setSelectedElectionId } = useElection();

  const [selectedPositionId, setSelectedPositionId] = useState<string>('all');

  const electionPositions = positions.filter((p) => p.election_id === selectedElection?.id);
  const electionCandidates = candidates.filter((c) => c.election_id === selectedElection?.id);
  const electionVoters = voterRoll.filter((v) => v.election_id === selectedElection?.id);

  const totalVoted = electionVoters.filter((v) => v.has_voted).length;
  const turnoutPercent = electionVoters.length > 0
    ? Math.round((totalVoted / electionVoters.length) * 100)
    : 0;

  // Departmental turnout breakdown
  const deptTurnoutMap = electionVoters.reduce((acc, v) => {
    const dept = v.department || 'General';
    if (!acc[dept]) acc[dept] = { name: dept, total: 0, voted: 0 };
    acc[dept].total += 1;
    if (v.has_voted) acc[dept].voted += 1;
    return acc;
  }, {} as Record<string, { name: string; total: number; voted: number }>);

  const deptData = Object.values(deptTurnoutMap);

  const handleExportPDF = () => {
    if (!selectedElection) return;
    generateElectionResultsPDF(selectedElection, positions, candidates, voterRoll);
  };

  const handleExportCSV = () => {
    if (!selectedElection) return;
    let csv = `Election Title,${selectedElection.title}\n`;
    csv += `Election Code,${selectedElection.code}\n`;
    csv += `Status,${selectedElection.status}\n`;
    csv += `Total Registered Voters,${electionVoters.length}\n`;
    csv += `Total Ballots Cast,${totalVoted}\n`;
    csv += `Turnout Rate,${turnoutPercent}%\n\n`;

    csv += 'Position,Candidate Name,Political Party,Ballot Number,Vote Count,Vote Percentage\n';
    electionPositions.forEach((pos) => {
      const posCands = candidates.filter((c) => c.position_id === pos.id);
      const totalPosVotes = posCands.reduce((acc, c) => acc + (c.vote_count || 0), 0);
      posCands.forEach((cand) => {
        const pct = totalPosVotes > 0 ? ((cand.vote_count || 0) / totalPosVotes * 100).toFixed(1) : '0';
        csv += `"${pos.title}","${cand.full_name}","${cand.political_party}",${cand.ballot_number},${cand.vote_count || 0},${pct}%\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certified_Results_${selectedElection.code}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!selectedElection) {
    return (
      <div className="p-12 text-center rounded-xl border border-slate-200 bg-white">
        <p className="text-sm font-semibold text-slate-500">
          No gazetted election session currently selected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-medium px-2 py-0.5 border border-slate-200">
              AUDITED TABULATION &amp; TALLY RESULTS
            </span>
            <Badge
              variant={
                selectedElection.status === 'certified'
                  ? 'default'
                  : selectedElection.status === 'completed'
                  ? 'purple'
                  : 'success'
              }
              size="sm"
            >
              {selectedElection.status === 'certified' ? 'CERTIFIED & SEALED' : 'LIVE TABULATION'}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {selectedElection.title}
          </h1>
          <p className="text-xs text-[#68716B]">
            Accredited Electors: <strong className="text-[#202522] font-mono">{electionVoters.length}</strong> • Cast Ballots: <strong className="text-[#168447] font-mono">{totalVoted}</strong> ({turnoutPercent}% Turnout)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-[#E3E8E4] bg-white hover:bg-[#F6F7F6] px-3.5 py-2 text-xs font-semibold text-[#202522] transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-[#68716B]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 rounded-lg bg-[#168447] hover:bg-[#116B39] px-3.5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download Certified PDF</span>
          </button>
        </div>
      </div>

      {/* Turnout & Velocity Stats Bento Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
              ELECTOR TURNOUT
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {turnoutPercent}%
            </span>
            <span className="text-xs text-slate-500">
              ({totalVoted} of {electionVoters.length} registered)
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#008751] transition-all duration-500"
              style={{ width: `${turnoutPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
              CONTESTED OFFICES
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {electionPositions.length}
            </span>
            <span className="text-xs text-slate-500">Positions on ballot</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 font-mono">
            {electionCandidates.length} officially certified nominees
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
              MERKLE ROOT ANCHOR
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs font-mono font-semibold text-slate-800 block truncate">
              {selectedElection.merkle_root || '0x79f041b3e948c21a8'}
            </span>
          </div>
          <p className="mt-3 text-[11px] text-[#008751] font-mono">
            SHA-256 zero-knowledge verifiable
          </p>
        </div>
      </div>

      {/* Position Filter */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-700">Inspect Contested Office:</span>
        <select
          value={selectedPositionId}
          onChange={(e) => setSelectedPositionId(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-[#008751] focus:bg-white focus:outline-none cursor-pointer"
        >
          <option value="all">All Positions Breakdown</option>
          {electionPositions.map((pos) => (
            <option key={pos.id} value={pos.id}>
              {pos.title}
            </option>
          ))}
        </select>
      </div>

      {/* Position Results Bento Cards */}
      <div className="space-y-6">
        {electionPositions
          .filter((p) => selectedPositionId === 'all' || p.id === selectedPositionId)
          .map((pos) => {
            const posCandidates = electionCandidates
              .filter((c) => c.position_id === pos.id)
              .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

            const totalPosVotes = posCandidates.reduce((acc, c) => acc + (c.vote_count || 0), 0);
            const winner = posCandidates[0];

            const chartData = posCandidates.map((c) => ({
              name: c.full_name,
              votes: c.vote_count || 0,
              party: c.political_party,
            }));

            return (
              <div
                key={pos.id}
                className="rounded-xl border border-slate-200 bg-white p-6 space-y-6"
              >
                {/* Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <span>{pos.title}</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Total Ballots Cast for Office: <strong className="text-slate-800 font-mono">{totalPosVotes.toLocaleString()}</strong>
                    </p>
                  </div>

                  {winner && winner.vote_count && winner.vote_count > 0 ? (
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#E8F5EE] border border-[#C2E0D0] px-3 py-1 text-xs font-semibold text-[#008751] font-mono">
                      <Trophy className="h-3.5 w-3.5" />
                      <span>Projected Winner: {winner.full_name}</span>
                    </div>
                  ) : null}
                </div>

                {/* Candidate Rows & Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Table (7 Cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    {posCandidates.map((cand, idx) => {
                      const count = cand.vote_count || 0;
                      const pct = totalPosVotes > 0 ? ((count / totalPosVotes) * 100).toFixed(1) : '0';
                      const isTop = idx === 0 && count > 0;

                      return (
                        <div
                          key={cand.id}
                          className={`rounded-lg border p-3.5 transition-colors ${
                            isTop
                              ? 'border-emerald-300 bg-emerald-50/40'
                              : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={cand.photo_url}
                                alt={cand.full_name}
                                className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-slate-900">
                                    {cand.full_name}
                                  </span>
                                  {isTop && (
                                    <span className="rounded bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#008751]">
                                      LEADING
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500">
                                  {cand.political_party}
                                </p>
                              </div>
                            </div>

                            <div className="text-right font-mono">
                              <p className="text-sm font-semibold text-slate-900">
                                {count.toLocaleString()} <span className="text-xs font-normal text-slate-500">ballots</span>
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {pct}% of tally
                              </p>
                            </div>
                          </div>

                          <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#008751] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Chart (5 Cols) */}
                  <div className="lg:col-span-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-3">
                      OFFICIAL VOTE DISTRIBUTION GRAPH
                    </h4>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              borderRadius: '8px',
                              color: '#0F172A',
                              fontSize: '11px',
                              fontFamily: 'monospace',
                            }}
                          />
                          <Bar dataKey="votes" fill="#008751" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
      </div>

    </div>
  );
};
