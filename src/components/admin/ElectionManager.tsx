import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  Edit,
  Trash2,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  Award,
  Search,
  Layers,
  Sparkles
} from 'lucide-react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { Election, ElectionStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const ElectionManager: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    elections,
    selectedElectionId,
    setSelectedElectionId,
    createElection,
    updateElection,
    updateElectionStatus,
    deleteElection,
    certifyElection,
  } = useElection();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [certifyModalOpen, setCertifyModalOpen] = useState(false);
  const [electionToCertify, setElectionToCertify] = useState<Election | null>(null);
  const [certifierName, setCertifierName] = useState(currentUser?.full_name || 'Dr. Sarah Chen');

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    category: 'University' as Election['category'],
    start_time: new Date().toISOString().slice(0, 16),
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    require_pin_verification: true,
    allow_realtime_results: true,
  });

  const handleOpenCreate = () => {
    setEditingElection(null);
    setFormData({
      title: '',
      code: `ELEC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      category: 'University',
      start_time: new Date().toISOString().slice(0, 16),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      require_pin_verification: true,
      allow_realtime_results: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (election: Election) => {
    setEditingElection(election);
    setFormData({
      title: election.title,
      code: election.code,
      description: election.description,
      category: election.category,
      start_time: new Date(election.start_time).toISOString().slice(0, 16),
      end_time: new Date(election.end_time).toISOString().slice(0, 16),
      require_pin_verification: election.require_pin_verification,
      allow_realtime_results: election.allow_realtime_results,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingElection) {
      await updateElection(editingElection.id, {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      });
    } else {
      await createElection({
        ...formData,
        created_by: currentUser?.id || 'usr-admin-1',
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      });
    }
    setIsModalOpen(false);
  };

  const handleExecuteCertify = async () => {
    if (electionToCertify) {
      await certifyElection(electionToCertify.id, certifierName);
      setCertifyModalOpen(false);
      setElectionToCertify(null);
    }
  };

  const filteredElections = elections.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: ElectionStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'blue';
      case 'paused': return 'warning';
      case 'completed': return 'purple';
      case 'certified': return 'default';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              ELECTORAL GAZETTE &amp; MANAGEMENT
            </span>
          </div>
          <h2 className="text-xl font-crest font-semibold text-slate-900 mt-1">
            Gazetted Elections Administration
          </h2>
          <p className="text-xs text-slate-500">
            Create, schedule, activate, pause, and officially certify federal and institutional election sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 sm:w-64 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-3.5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Gazette New Election</span>
          </button>
        </div>
      </div>

      {/* Elections Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredElections.map((elec) => {
          const isSelected = elec.id === selectedElectionId;
          return (
            <div
              key={elec.id}
              className={`flex flex-col justify-between rounded-xl border bg-white p-5 transition-colors ${
                isSelected
                  ? 'border-[#008751] ring-1 ring-[#008751]/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {elec.code}
                  </span>
                  <Badge variant={getStatusBadgeVariant(elec.status)} size="sm" dot>
                    {elec.status.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-base font-official font-bold text-slate-900 line-clamp-2">
                  {elec.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {elec.description || 'No description provided.'}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Starts: {new Date(elec.start_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Ends: {new Date(elec.end_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 font-mono">
                    <span className="text-slate-500">Ballots Cast:</span>
                    <span className="font-semibold text-slate-900">
                      {elec.total_votes_cast} / {elec.max_registered_voters}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedElectionId(elec.id)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold font-mono transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#008751] text-white'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {isSelected ? 'Active Context' : 'Set Active'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(elec)}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Settings"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to permanently delete election ${elec.code}?`)) {
                        deleteElection(elec.id);
                      }
                    }}
                    className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete Election"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* State Control Buttons */}
                <div className="flex items-center gap-1.5">
                  {elec.status === 'draft' && (
                    <button
                      onClick={() => updateElectionStatus(elec.id, 'active')}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[#008751] hover:bg-[#007043] py-1.5 text-xs font-semibold font-mono text-white transition-colors cursor-pointer"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      <span>Activate Session</span>
                    </button>
                  )}

                  {elec.status === 'active' && (
                    <>
                      <button
                        onClick={() => updateElectionStatus(elec.id, 'paused')}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-slate-50 hover:bg-slate-100 py-1.5 text-xs font-semibold font-mono text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <PauseCircle className="h-3.5 w-3.5 text-slate-500" />
                        <span>Pause Voting</span>
                      </button>
                      <button
                        onClick={() => updateElectionStatus(elec.id, 'completed')}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-slate-50 hover:bg-slate-100 py-1.5 text-xs font-semibold font-mono text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
                        <span>Close Polls</span>
                      </button>
                    </>
                  )}

                  {elec.status === 'paused' && (
                    <button
                      onClick={() => updateElectionStatus(elec.id, 'active')}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[#008751] hover:bg-[#007043] py-1.5 text-xs font-semibold font-mono text-white transition-colors cursor-pointer"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      <span>Resume Session</span>
                    </button>
                  )}

                  {elec.status === 'completed' && (
                    <button
                      onClick={() => {
                        setElectionToCertify(elec);
                        setCertifyModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[#008751] hover:bg-[#007043] py-1.5 text-xs font-semibold font-mono text-white transition-colors cursor-pointer"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>Certify &amp; Seal</span>
                    </button>
                  )}

                  {elec.status === 'certified' && (
                    <div className="w-full rounded-lg bg-emerald-50 p-1.5 text-center font-mono text-[10px] font-semibold text-[#008751] border border-emerald-200">
                      SEALED &amp; CERTIFIED
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Election Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingElection ? 'Edit Gazetted Election' : 'Gazette New Election Session'}
        subtitle="Configure election parameters, voting schedules, and cryptographic verification policies"
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-slate-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Election Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="2026 Federal Presidential & Legislative Election"
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unique Election Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="INEC-2026-FED"
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-mono uppercase text-slate-900 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description &amp; Gazetted Mandate
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Democratic election to determine executive leadership and parliamentary representatives."
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Election['category'] })}
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-[#008751] focus:outline-none cursor-pointer"
              >
                <option value="General">National / General Public</option>
                <option value="University">University / Student Union</option>
                <option value="Corporate">Corporate Board</option>
                <option value="Association">Professional Bar / Assoc (NBA, ICAN)</option>
                <option value="Union">Labor Union (NLC, TUC)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Voting Start Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-[#008751] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Voting End Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-[#008751] focus:outline-none"
              />
            </div>
          </div>

          {/* Security & Verification toggles */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Security &amp; Integrity Controls
            </h4>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-600">
                Require Individual 6-Digit Verification PIN on Ballot Submission
              </label>
              <input
                type="checkbox"
                checked={formData.require_pin_verification}
                onChange={(e) => setFormData({ ...formData, require_pin_verification: e.target.checked })}
                className="h-4 w-4 rounded accent-[#008751]"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-600">
                Allow Real-Time Live Tally Visualization
              </label>
              <input
                type="checkbox"
                checked={formData.allow_realtime_results}
                onChange={(e) => setFormData({ ...formData, allow_realtime_results: e.target.checked })}
                className="h-4 w-4 rounded accent-[#008751]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#008751] hover:bg-[#007043] px-5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              {editingElection ? 'Save Changes' : 'Initialize Session'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Certify Election Modal */}
      <Modal
        isOpen={certifyModalOpen}
        onClose={() => setCertifyModalOpen(false)}
        title="Officially Certify Election Results"
        subtitle="Permanently seal tally & produce cryptographic Merkle root signature"
        maxWidth="md"
        icon={<Award className="h-5 w-5 text-[#008751]" />}
      >
        <div className="space-y-4 py-2 text-slate-900">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <strong>Permanent Finalization:</strong> Once certified, no additional ballots or modifications can be admitted. All tallies are cryptographically locked and anchored.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Certifying Authority / Returning Officer Name
            </label>
            <input
              type="text"
              value={certifierName}
              onChange={(e) => setCertifierName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-[#008751] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setCertifyModalOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteCertify}
              className="rounded-lg bg-[#008751] hover:bg-[#007043] px-5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Confirm &amp; Certify Gazette
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
