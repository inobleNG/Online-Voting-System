import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  KeyRound,
  ShieldCheck,
  FileSpreadsheet,
  Eye,
  EyeOff,
  CreditCard,
  QrCode,
  Sparkles
} from 'lucide-react';
import { useElection } from '../../context/ElectionContext';
import { VoterEligibility } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { PhotoUploader } from '../common/PhotoUploader';
import { NigeriaFlag, NigeriaCrest } from '../common/NigeriaCrest';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

export const VoterRollManager: React.FC = () => {
  const { selectedElection, voterRoll, addVoterToRoll, bulkImportVoters, toggleVoterStatus } = useElection();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'voted' | 'pending' | 'blocked'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isPvcModalOpen, setIsPvcModalOpen] = useState(false);
  const [selectedPvcVoter, setSelectedPvcVoter] = useState<VoterEligibility | null>(null);
  const [csvRawText, setCsvRawText] = useState('');
  const [revealedPins, setRevealedPins] = useState<{ [key: string]: boolean }>({});

  // Single voter form with Nigerian fields
  const [formData, setFormData] = useState({
    voter_id: '',
    vin_number: '',
    nin_number: '',
    full_name: '',
    email: '',
    phone: '',
    state: 'Lagos',
    lga: 'Ikeja',
    ward: 'Ward 01 - Alausa',
    polling_unit: 'PU: 24/08/01/012',
    department: 'Federal Elector Constituency',
    passport_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verification_pin: Math.floor(100000 + Math.random() * 900000).toString(),
    status: 'eligible' as VoterEligibility['status'],
  });

  const electionVoters = voterRoll.filter((v) => v.election_id === selectedElection?.id);

  const filteredVoters = electionVoters.filter((voter) => {
    const matchSearch =
      voter.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.voter_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voter.vin_number && voter.vin_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (voter.nin_number && voter.nin_number.includes(searchTerm)) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voter.state && voter.state.toLowerCase().includes(searchTerm.toLowerCase()));

    if (statusFilter === 'voted') return matchSearch && voter.has_voted;
    if (statusFilter === 'pending') return matchSearch && !voter.has_voted && voter.status !== 'blocked';
    if (statusFilter === 'blocked') return matchSearch && voter.status === 'blocked';
    return matchSearch;
  });

  const handleOpenAdd = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      voter_id: `VTR-2026-${randomSuffix}`,
      vin_number: `90F5 B028 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} 01`,
      nin_number: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      full_name: '',
      email: '',
      phone: '+234 803 ' + Math.floor(1000000 + Math.random() * 9000000),
      state: 'Lagos',
      lga: 'Ikeja',
      ward: 'Ward 01 - Alausa',
      polling_unit: `PU: 24/08/01/${Math.floor(100 + Math.random() * 900)}`,
      department: 'Federal Elector Constituency',
      passport_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      verification_pin: Math.floor(100000 + Math.random() * 900000).toString(),
      status: 'eligible',
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElection) return;

    addVoterToRoll({
      ...formData,
      election_id: selectedElection.id,
    });
    setIsAddModalOpen(false);
  };

  const handleCsvBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElection || !csvRawText.trim()) return;

    const lines = csvRawText.trim().split('\n');
    const parsed: Array<Omit<VoterEligibility, 'id' | 'has_voted'>> = [];

    lines.forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2 && !parts[0].toLowerCase().includes('voter_id') && !parts[0].toLowerCase().includes('vin')) {
        const vId = parts[0];
        const name = parts[1];
        const email = parts[2] || `${vId.toLowerCase()}@elections.gov.ng`;
        const dept = parts[3] || 'Accredited Ward Register';
        const pin = parts[4] || Math.floor(100000 + Math.random() * 900000).toString();
        const vin = parts[5] || `90F5 B028 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} 01`;
        const nin = parts[6] || `${Math.floor(10000000000 + Math.random() * 90000000000)}`;
        const state = parts[7] || 'Lagos';
        const pu = parts[8] || 'PU: 24/08/01/012';

        parsed.push({
          election_id: selectedElection.id,
          voter_id: vId,
          full_name: name,
          email,
          department: dept,
          verification_pin: pin,
          vin_number: vin,
          nin_number: nin,
          state,
          polling_unit: pu,
          status: 'eligible',
        });
      }
    });

    if (parsed.length > 0) {
      bulkImportVoters(parsed);
      setCsvRawText('');
      setIsCsvModalOpen(false);
    }
  };

  const togglePin = (voterId: string) => {
    setRevealedPins((prev) => ({ ...prev, [voterId]: !prev[voterId] }));
  };

  const handleOpenPvc = (voter: VoterEligibility) => {
    setSelectedPvcVoter(voter);
    setIsPvcModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#008751] flex items-center justify-center text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-crest font-semibold text-slate-900">
                National Voter Accreditation &amp; PVC Register
              </h2>
              <NigeriaFlag width={20} height={14} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited elector rolls, biometric VIN/NIN verification pins, and digital PVC cards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            disabled={!selectedElection}
            className="flex items-center gap-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-slate-500" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            onClick={handleOpenAdd}
            disabled={!selectedElection}
            className="flex items-center gap-2 rounded-lg bg-[#008751] hover:bg-[#007043] text-white px-4 py-2 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            <span>Accredit New Voter</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase font-medium">Total Registered</p>
            <p className="text-xl font-bold font-mono text-slate-900">{electionVoters.length}</p>
          </div>
          <Users className="w-5 h-5 text-slate-400" />
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase font-medium">Accredited &amp; Voted</p>
            <p className="text-xl font-bold font-mono text-[#008751]">
              {electionVoters.filter((v) => v.has_voted).length}
            </p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-[#008751]" />
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase font-medium">Awaiting Ballot</p>
            <p className="text-xl font-bold font-mono text-slate-800">
              {electionVoters.filter((v) => !v.has_voted && v.status !== 'blocked').length}
            </p>
          </div>
          <Clock className="w-5 h-5 text-slate-400" />
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase font-medium">Turnout Rate</p>
            <p className="text-xl font-bold font-mono text-slate-900">
              {electionVoters.length > 0
                ? Math.round((electionVoters.filter((v) => v.has_voted).length / electionVoters.length) * 100)
                : 0}
              %
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-[#008751]" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Voter Name, VIN, NIN, Polling Unit, or State..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#008751]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008751] cursor-pointer"
          >
            <option value="all">All Voter Statuses ({electionVoters.length})</option>
            <option value="pending">Pending Ballot Casting</option>
            <option value="voted">Accredited &amp; Voted</option>
            <option value="blocked">Suspended / Ineligible</option>
          </select>
        </div>
      </div>

      {/* Voter Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] tracking-wider uppercase">
                <th className="p-3.5">Elector Information</th>
                <th className="p-3.5">VIN / NIN Identifiers</th>
                <th className="p-3.5">Location &amp; Polling Unit</th>
                <th className="p-3.5">Ballot Status</th>
                <th className="p-3.5">Verification PIN</th>
                <th className="p-3.5 text-right">Digital PVC &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredVoters.map((voter) => {
                const isRevealed = revealedPins[voter.id];
                return (
                  <tr key={voter.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Elector Info */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={voter.passport_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={voter.full_name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{voter.full_name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{voter.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Identifiers */}
                    <td className="p-3.5">
                      <div className="font-mono space-y-0.5">
                        <div className="text-slate-900 font-semibold text-[11px]">
                          VIN: {voter.vin_number || voter.voter_id}
                        </div>
                        {voter.nin_number && (
                          <div className="text-slate-500 text-[10px]">
                            NIN: {voter.nin_number}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <p className="text-slate-800 font-medium">
                          {voter.state || 'Lagos'} • {voter.lga || 'Ikeja'}
                        </p>
                        <p className="text-[10px] font-mono text-[#008751]">
                          {voter.polling_unit || 'PU: 24/08/01/012'}
                        </p>
                      </div>
                    </td>

                    {/* Ballot Status */}
                    <td className="p-3.5">
                      {voter.has_voted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-[#008751] font-mono font-semibold text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VOTED</span>
                        </span>
                      ) : voter.status === 'blocked' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-mono font-semibold text-[10px] border border-rose-200">
                          <Ban className="w-3 h-3" />
                          <span>SUSPENDED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-mono font-semibold text-[10px] border border-slate-200">
                          <Clock className="w-3 h-3" />
                          <span>ELIGIBLE</span>
                        </span>
                      )}
                    </td>

                    {/* PIN */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-800 font-semibold text-xs">
                          {isRevealed ? voter.verification_pin : '••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePin(voter.id)}
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                          title={isRevealed ? 'Hide PIN' : 'Reveal PIN'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Digital PVC & Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenPvc(voter)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer text-xs font-medium"
                          title="View Official Digital PVC"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-[#008751]" />
                          <span>View PVC</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleVoterStatus(voter.id, voter.status === 'blocked' ? 'eligible' : 'blocked')}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            voter.status === 'blocked'
                              ? 'bg-emerald-50 text-[#008751] border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                          }`}
                          title={voter.status === 'blocked' ? 'Unblock Voter' : 'Suspend Voter'}
                        >
                          {voter.status === 'blocked' ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredVoters.length === 0 && (
          <div className="text-center py-10 p-4">
            <p className="text-xs text-slate-500">No voter records match your search criteria.</p>
          </div>
        )}
      </div>

      {/* ACCREDIT NEW VOTER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Accredit New Voter (Federal Elector Roll)"
        subtitle="Register voter with National Identity Number (NIN), Voter Identification (VIN), and passport photograph"
        maxWidth="2xl"
        icon={<UserPlus className="h-5 w-5 text-emerald-400" />}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-[#FAFAFA]">
          
          {/* Photo Uploader */}
          <PhotoUploader
            currentPhotoUrl={formData.passport_photo}
            onPhotoChange={(url) => setFormData({ ...formData, passport_photo: url })}
            label="Elector Passport Photograph"
            helperText="Upload passport photo for permanent voter card (PVC) accreditation"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Oluwaseun Emmanuel Adebayo"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. o.adebayo@nigeria.gov.ng"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Voter Identification Number (VIN) *
              </label>
              <input
                type="text"
                required
                value={formData.vin_number}
                onChange={(e) => setFormData({ ...formData, vin_number: e.target.value, voter_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#008751] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                National Identity Number (NIN) (11 Digits)
              </label>
              <input
                type="text"
                placeholder="e.g. 74921094812"
                value={formData.nin_number}
                onChange={(e) => setFormData({ ...formData, nin_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#008751] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                State of Residence
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751] focus:bg-white transition-colors cursor-pointer"
              >
                {NIGERIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st} State
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                LGA / District
              </label>
              <input
                type="text"
                value={formData.lga}
                onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Assigned Polling Unit (PU)
              </label>
              <input
                type="text"
                value={formData.polling_unit}
                onChange={(e) => setFormData({ ...formData, polling_unit: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#008751] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900">6-Digit Secret E-Voting PIN</p>
              <p className="text-[10px] text-slate-500">Issued securely to the voter for booth authentication</p>
            </div>
            <div className="font-mono text-base font-bold text-[#008751] bg-white px-3 py-1 rounded border border-slate-200">
              {formData.verification_pin}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 bg-white border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#008751] hover:bg-[#007043] transition-colors cursor-pointer"
            >
              Accredit Voter &amp; Issue PVC
            </button>
          </div>
        </form>
      </Modal>

      {/* DIGITAL PVC CARD PREVIEW MODAL */}
      <Modal
        isOpen={isPvcModalOpen}
        onClose={() => setIsPvcModalOpen(false)}
        title="Official Permanent Voter Card (PVC)"
        subtitle="Federal Republic of Nigeria — Independent National Electoral Accreditation"
        maxWidth="lg"
        icon={<CreditCard className="h-5 w-5 text-[#008751]" />}
      >
        {selectedPvcVoter && (
          <div className="space-y-4">
            {/* Flat PVC Card Graphic */}
            <div className="relative rounded-xl bg-[#008751] text-white p-5 border border-[#00683E] overflow-hidden">
              
              {/* Background Watermark Crest */}
              <div className="absolute right-2 top-2 opacity-15 pointer-events-none">
                <NigeriaCrest size="xl" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <NigeriaCrest size="sm" />
                  <div>
                    <h3 className="font-mono text-[10px] tracking-widest text-emerald-200 uppercase font-semibold">
                      Federal Republic of Nigeria
                    </h3>
                    <p className="text-[8px] font-mono uppercase tracking-wider text-white/90">
                      Permanent Voter Card (PVC)
                    </p>
                  </div>
                </div>
                <NigeriaFlag width={26} height={16} />
              </div>

              {/* Card Body */}
              <div className="flex gap-4">
                <div className="shrink-0 space-y-1 text-center">
                  <img
                    src={selectedPvcVoter.passport_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={selectedPvcVoter.full_name}
                    className="w-20 h-24 rounded-lg object-cover border border-white/40 bg-slate-900"
                  />
                  <span className="text-[8px] font-mono font-medium text-emerald-200 block">
                    BIOMETRIC VERIFIED
                  </span>
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-white/70 font-mono">Full Name</p>
                    <p className="font-semibold text-sm text-white">{selectedPvcVoter.full_name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                    <div>
                      <p className="text-[8px] uppercase text-white/70 font-mono">State / LGA</p>
                      <p className="font-medium text-white">{selectedPvcVoter.state || 'Lagos'} / {selectedPvcVoter.lga || 'Ikeja'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase text-white/70 font-mono">Secret PIN</p>
                      <p className="font-mono font-bold text-emerald-200">{selectedPvcVoter.verification_pin}</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-[8px] uppercase text-white/70 font-mono">Voter ID Number (VIN)</p>
                    <p className="font-mono font-semibold text-xs text-emerald-200">
                      {selectedPvcVoter.vin_number || selectedPvcVoter.voter_id}
                    </p>
                  </div>

                  <div className="pt-0.5">
                    <p className="text-[8px] uppercase text-white/70 font-mono">Polling Unit</p>
                    <p className="font-mono text-[9px] text-white/90">{selectedPvcVoter.polling_unit || 'PU: 24/08/01/012'}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer Barcode Stripe */}
              <div className="mt-4 pt-2 border-t border-white/20 flex items-center justify-between text-[9px] font-mono text-white/80">
                <span>INEC-SECURE-CHIP-V3</span>
                <span className="text-emerald-200 font-semibold">STATUS: ACCREDITED ELECTOR</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsPvcModalOpen(false)}
                className="px-5 py-2 bg-[#008751] hover:bg-[#007043] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* CSV BULK IMPORT MODAL */}
      <Modal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        title="Bulk Import Voter Roll (CSV Format)"
        subtitle="Import thousands of accredited electors from state electoral rosters"
        maxWidth="2xl"
        icon={<FileSpreadsheet className="h-5 w-5 text-[#008751]" />}
      >
        <form onSubmit={handleCsvBulkSubmit} className="space-y-4 text-slate-900">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 space-y-1">
            <p className="text-[#008751] font-semibold">Expected CSV Column Order:</p>
            <p>VOTER_ID, FULL_NAME, EMAIL, DEPARTMENT, PIN, VIN, NIN, STATE, POLLING_UNIT</p>
            <p className="text-[10px] text-slate-500">Example: VTR-2026-901, Amina Bello, amina@nigeria.gov.ng, Ward 4, 882194, 90F5 B028 1429 8812 01, 74921094812, Kano, PU: 19/02/04/001</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Paste CSV Data:
            </label>
            <textarea
              rows={8}
              required
              value={csvRawText}
              onChange={(e) => setCsvRawText(e.target.value)}
              placeholder="VTR-2026-901, Amina Bello, amina@nigeria.gov.ng, Ward 4, 882194, 90F5 B028 1429 8812 01, 74921094812, Kano, PU: 19/02/04/001&#10;VTR-2026-902, Chukwuma Obi, obi@nigeria.gov.ng, Ward 2, 449102, 90F5 B028 1429 8812 02, 88392019482, Anambra, PU: 04/01/02/003"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#008751] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsCsvModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 bg-white border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#008751] hover:bg-[#007043] transition-colors cursor-pointer"
            >
              Process &amp; Accredit Roster
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
