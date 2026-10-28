import React, { useState } from 'react';
import {
  Plus,
  Award,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Search,
  Filter,
  Download,
  Upload,
  Sparkles
} from 'lucide-react';
import { useElection } from '../../context/ElectionContext';
import { Candidate } from '../../types';
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

const NIGERIAN_PARTIES = [
  { name: 'All Progressives Congress', acronym: 'APC' },
  { name: "Peoples Democratic Party", acronym: 'PDP' },
  { name: 'Labour Party', acronym: 'LP' },
  { name: 'New Nigeria Peoples Party', acronym: 'NNPP' },
  { name: 'All Progressives Grand Alliance', acronym: 'APGA' },
  { name: 'African Democratic Congress', acronym: 'ADC' },
  { name: 'Social Democratic Party', acronym: 'SDP' },
  { name: 'Young Progressives Party', acronym: 'YPP' },
  { name: 'Independent Candidate', acronym: 'IND' },
];

export const CandidateManager: React.FC = () => {
  const { selectedElection, positions, candidates, addCandidate, updateCandidate, deleteCandidate } = useElection();

  const [selectedPosFilter, setSelectedPosFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    position_id: '',
    full_name: '',
    running_mate: '',
    ballot_number: 1,
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    political_party: 'All Progressives Congress',
    political_party_acronym: 'APC',
    state_of_origin: 'Lagos',
    motto: 'Leadership with integrity, transparency and accelerated development.',
    biography: 'Accomplished public administrator and governance strategist with decades of dedicated civic service.',
    manifesto_points: [
      'Comprehensive Youth Employment & Digital Innovation Fund',
      'Revitalized Infrastructure, Solar Power & Quality Transportation',
      'Affordable Healthcare & Subsidized Primary Clinic Upgrades',
      'Educational Grants & Technical Vocational Training Centers'
    ],
    manifesto_pdf_name: 'Official_Candidate_Manifesto_2026.pdf',
    manifesto_pdf_url: '',
    status: 'active' as Candidate['status'],
  });

  const electionPositions = positions.filter((p) => p.election_id === selectedElection?.id);
  const electionCandidates = candidates.filter((c) => c.election_id === selectedElection?.id);

  const filteredCandidates = electionCandidates.filter((cand) => {
    const matchPos = selectedPosFilter === 'all' || cand.position_id === selectedPosFilter;
    const matchSearch =
      cand.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.political_party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.motto.toLowerCase().includes(searchTerm.toLowerCase());
    return matchPos && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingCandidate(null);
    setFormData({
      position_id: electionPositions[0]?.id || '',
      full_name: '',
      running_mate: '',
      ballot_number: electionCandidates.length + 1,
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      political_party: 'All Progressives Congress',
      political_party_acronym: 'APC',
      state_of_origin: 'Lagos',
      motto: 'Leadership with integrity, transparency and accelerated development.',
      biography: 'Experienced leader dedicated to institutional reform, public infrastructure, and economic empowerment.',
      manifesto_points: [
        'Comprehensive Youth Employment & Digital Innovation Fund',
        'Revitalized Infrastructure, Solar Power & Quality Transportation',
        'Affordable Healthcare & Subsidized Primary Clinic Upgrades',
        'Educational Grants & Technical Vocational Training Centers'
      ],
      manifesto_pdf_name: 'Official_Candidate_Manifesto_2026.pdf',
      manifesto_pdf_url: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cand: Candidate) => {
    setEditingCandidate(cand);
    setFormData({
      position_id: cand.position_id,
      full_name: cand.full_name,
      running_mate: cand.running_mate || '',
      ballot_number: cand.ballot_number,
      photo_url: cand.photo_url,
      political_party: cand.political_party,
      political_party_acronym: cand.political_party_acronym || 'APC',
      state_of_origin: cand.state_of_origin || 'Lagos',
      motto: cand.motto,
      biography: cand.biography,
      manifesto_points: cand.manifesto_points || [],
      manifesto_pdf_name: cand.manifesto_pdf_name || 'Manifesto.pdf',
      manifesto_pdf_url: cand.manifesto_pdf_url || '',
      status: cand.status,
    });
    setIsModalOpen(true);
  };

  const handlePartyChange = (partyName: string) => {
    const selectedParty = NIGERIAN_PARTIES.find((p) => p.name === partyName);
    setFormData({
      ...formData,
      political_party: partyName,
      political_party_acronym: selectedParty?.acronym || 'NAT',
    });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({
            ...formData,
            manifesto_pdf_name: file.name,
            manifesto_pdf_url: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElection) return;

    if (editingCandidate) {
      updateCandidate(editingCandidate.id, formData);
    } else {
      addCandidate({
        ...formData,
        election_id: selectedElection.id,
      });
    }
    setIsModalOpen(false);
  };

  const handleAddManifestoPoint = () => {
    setFormData({
      ...formData,
      manifesto_points: [...formData.manifesto_points, ''],
    });
  };

  const handleUpdateManifestoPoint = (idx: number, text: string) => {
    const updated = [...formData.manifesto_points];
    updated[idx] = text;
    setFormData({ ...formData, manifesto_points: updated });
  };

  const handleRemoveManifestoPoint = (idx: number) => {
    setFormData({
      ...formData,
      manifesto_points: formData.manifesto_points.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#008751] flex items-center justify-center text-white">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-crest font-semibold text-slate-900">
                Official Candidate Nomination Ledger
              </h2>
              <NigeriaFlag width={20} height={14} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited candidate rosters, passport photos, policy manifestos &amp; PDF gazettes
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          disabled={!selectedElection || electionPositions.length === 0}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#008751] hover:bg-[#007043] text-white px-4 py-2 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Nominate New Candidate</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, political party, or manifesto pledges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#008751]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={selectedPosFilter}
            onChange={(e) => setSelectedPosFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008751] cursor-pointer"
          >
            <option value="all">All Ballot Positions ({electionCandidates.length})</option>
            {electionPositions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCandidates.map((cand) => {
          const pos = positions.find((p) => p.id === cand.position_id);
          return (
            <div
              key={cand.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-4">
                {/* Header Profile Photo & Badges */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={cand.photo_url}
                      alt={cand.full_name}
                      className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#008751] font-mono font-bold text-white text-[10px]">
                      #{cand.ballot_number}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-crest text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {pos?.title || 'Ballot Position'}
                      </span>
                      <Badge variant={cand.status === 'active' ? 'success' : 'danger'} size="sm">
                        {cand.status.toUpperCase()}
                      </Badge>
                    </div>

                    <h3 className="font-official font-bold text-base text-slate-900 truncate mt-0.5">
                      {cand.full_name}
                    </h3>

                    <p className="text-xs text-[#008751] font-semibold flex items-center gap-1">
                      <span>{cand.political_party}</span>
                      {cand.political_party_acronym && (
                        <span className="font-mono text-[10px] text-slate-500">
                          ({cand.political_party_acronym})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Slogan */}
                <div className="p-2.5 bg-slate-50 border-l-2 border-[#008751] rounded-r-lg">
                  <p className="text-xs italic text-slate-600 line-clamp-2">
                    "{cand.motto}"
                  </p>
                </div>

                {/* Key Manifesto Highlights */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-medium text-slate-500 uppercase flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#008751]" />
                    <span>Manifesto Initiatives:</span>
                  </span>
                  <div className="space-y-1">
                    {cand.manifesto_points?.slice(0, 2).map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <span className="w-1 h-1 rounded-full bg-[#008751]" />
                        <span className="truncate">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDF Manifesto indicator */}
                {cand.manifesto_pdf_name && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-200">
                    <FileText className="w-3 h-3 text-[#008751]" />
                    <span className="truncate">{cand.manifesto_pdf_name}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  Ballot #{cand.ballot_number}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cand)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                    title="Edit Candidate & Manifesto"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCandidate(cand.id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Candidate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-6">
          <Award className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-bold text-slate-800">No candidates match the filter.</p>
          <p className="text-xs text-slate-500 mt-1">Click "Nominate New Candidate" to register verified nominees.</p>
        </div>
      )}

      {/* Candidate Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCandidate ? 'Edit Candidate Dossier' : 'Accredit & Nominate Candidate'}
        subtitle="Upload candidate passport photograph, political party details, and PDF manifesto compact"
        maxWidth="3xl"
        icon={<Award className="h-5 w-5 text-[#008751]" />}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-slate-900">
          
          {/* Position & Ballot Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 font-crest mb-1">
                Contested Position *
              </label>
              <select
                required
                value={formData.position_id}
                onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
              >
                {electionPositions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 font-crest mb-1">
                Official Ballot Slot Number *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.ballot_number}
                onChange={(e) => setFormData({ ...formData, ballot_number: parseInt(e.target.value) || 1 })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
              />
            </div>
          </div>

          {/* Photo Upload Section */}
          <PhotoUploader
            currentPhotoUrl={formData.photo_url}
            onPhotoChange={(url) => setFormData({ ...formData, photo_url: url })}
            label="Candidate Passport Photograph (Real File Upload)"
            helperText="Select or drag-and-drop a portrait photo. Will be printed on all official digital ballots."
          />

          {/* Candidate Full Name & Running Mate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 font-crest mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chief Babatunde Adeleke"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 font-crest mb-1">
                Running Mate / Deputy (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Ngozi Okafor"
                value={formData.running_mate}
                onChange={(e) => setFormData({ ...formData, running_mate: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
              />
            </div>
          </div>

          {/* Political Party & State of Origin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 font-crest mb-1">
                Political Party *
              </label>
              <select
                value={formData.political_party}
                onChange={(e) => handlePartyChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
              >
                {NIGERIAN_PARTIES.map((party) => (
                  <option key={party.acronym} value={party.name}>
                    {party.name} ({party.acronym})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 font-crest mb-1">
                State of Origin
              </label>
              <select
                value={formData.state_of_origin}
                onChange={(e) => setFormData({ ...formData, state_of_origin: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
              >
                {NIGERIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st} State
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slogan Motto */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 font-crest mb-1">
              Campaign Slogan / Motto *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Renewed Hope &amp; Incorruptible Prosperity"
              value={formData.motto}
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
            />
          </div>

          {/* Biography */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 font-crest mb-1">
              Candidate Biography &amp; Public Record
            </label>
            <textarea
              rows={3}
              placeholder="Enter comprehensive biography and legislative qualifications..."
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
            />
          </div>

          {/* PDF Manifesto Upload Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 font-crest">
                Upload PDF Manifesto Document
              </label>
              <span className="text-[10px] font-mono text-slate-500">Supports PDF files</span>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Choose PDF File</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
              </label>

              <div className="text-xs text-slate-500 truncate flex-1">
                {formData.manifesto_pdf_name ? (
                  <span className="text-[#008751] font-mono flex items-center gap-1 font-medium">
                    <FileText className="w-3.5 h-3.5" />
                    {formData.manifesto_pdf_name}
                  </span>
                ) : (
                  <span>No PDF attached yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Manifesto Key Points List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 font-crest">
                Key Policy Initiatives &amp; Manifesto Pledges
              </label>
              <button
                type="button"
                onClick={handleAddManifestoPoint}
                className="text-xs font-mono text-[#008751] hover:text-[#007043] flex items-center gap-1 cursor-pointer font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.manifesto_points.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono font-medium text-xs flex items-center justify-center shrink-0 border border-slate-200">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => handleUpdateManifestoPoint(idx, e.target.value)}
                    placeholder={`Policy pledge #${idx + 1}`}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#008751]"
                  />
                  {formData.manifesto_points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveManifestoPoint(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 bg-white border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#008751] hover:bg-[#007043] transition-colors cursor-pointer"
            >
              {editingCandidate ? 'Save Candidate Dossier' : 'Confirm Nomination'}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};
