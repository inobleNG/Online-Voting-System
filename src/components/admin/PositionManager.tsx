import React, { useState } from 'react';
import { Plus, Layers, Edit, Trash2, ArrowUpDown, Award, AlertCircle } from 'lucide-react';
import { useElection } from '../../context/ElectionContext';
import { Position } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

export const PositionManager: React.FC = () => {
  const { selectedElection, positions, candidates, addPosition, updatePosition, deletePosition } = useElection();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    max_choices: 1,
    min_choices: 1,
    display_order: 1,
    required: true,
  });

  const electionPositions = positions
    .filter((p) => p.election_id === selectedElection?.id)
    .sort((a, b) => a.display_order - b.display_order);

  const handleOpenAdd = () => {
    setEditingPosition(null);
    setFormData({
      title: '',
      description: '',
      max_choices: 1,
      min_choices: 1,
      display_order: electionPositions.length + 1,
      required: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pos: Position) => {
    setEditingPosition(pos);
    setFormData({
      title: pos.title,
      description: pos.description || '',
      max_choices: pos.max_choices,
      min_choices: pos.min_choices,
      display_order: pos.display_order,
      required: pos.required,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElection) return;

    if (editingPosition) {
      updatePosition(editingPosition.id, formData);
    } else {
      addPosition({
        ...formData,
        election_id: selectedElection.id,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              BALLOT HIERARCHY &amp; CONTESTED SEATS
            </span>
          </div>
          <h2 className="text-xl font-crest font-semibold text-slate-900 mt-1">
            Contested Offices &amp; Ballot Structure
          </h2>
          <p className="text-xs text-slate-500">
            Define contested offices, candidate quotas, and voting rules for{' '}
            <strong className="text-slate-800">{selectedElection?.title}</strong>
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-3.5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Ballot Office</span>
        </button>
      </div>

      {electionPositions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Layers className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-crest font-semibold text-slate-900">No Positions Configured</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Add elective offices (e.g. President, Senatorial District, Governor, Treasurer) to this gazetted session.
          </p>
          <button
            onClick={handleOpenAdd}
            className="rounded-lg bg-[#008751] px-4 py-2 text-xs font-semibold text-white hover:bg-[#007043] transition-colors cursor-pointer"
          >
            Add First Position
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {electionPositions.map((pos) => {
            const posCandidates = candidates.filter((c) => c.position_id === pos.id);
            return (
              <div
                key={pos.id}
                className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      ORDER #{pos.display_order}
                    </span>
                    <Badge variant={pos.required ? 'blue' : 'neutral'} size="sm">
                      {pos.required ? 'MANDATORY' : 'OPTIONAL'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-official font-bold text-slate-900">
                    {pos.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {pos.description || 'No specific criteria defined for this office.'}
                  </p>

                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Max Selectable:</span>
                      <span className="text-slate-900 font-semibold">{pos.max_choices} candidate(s)</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Min Required:</span>
                      <span className="text-slate-900 font-semibold">{pos.min_choices} choice(s)</span>
                    </div>
                    <div className="flex justify-between text-slate-500 border-t border-slate-200/80 pt-1.5">
                      <span>Registered Nominees:</span>
                      <span className="text-[#008751] font-semibold">{posCandidates.length} candidate(s)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleOpenEdit(pos)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove position ${pos.title}? Associated candidate linkages will be removed.`)) {
                        deletePosition(pos.id);
                      }
                    }}
                    className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-mono text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPosition ? 'Edit Contested Office Rules' : 'Add Contested Office to Ballot'}
        subtitle="Define selection rules and ballot ordering"
        maxWidth="md"
        icon={<Layers className="h-5 w-5 text-[#008751]" />}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Position / Office Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Executive President of Nigeria"
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description &amp; Role Requirements
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Primary executive leadership responsibilities."
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Choices
              </label>
              <input
                type="number"
                min={1}
                max={10}
                required
                value={formData.max_choices}
                onChange={(e) => setFormData({ ...formData, max_choices: parseInt(e.target.value) || 1 })}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#008751] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Min Choices
              </label>
              <input
                type="number"
                min={0}
                max={formData.max_choices}
                required
                value={formData.min_choices}
                onChange={(e) => setFormData({ ...formData, min_choices: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#008751] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#008751] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="text-xs text-slate-600">
              Mandatory Position on Ballot
            </span>
            <input
              type="checkbox"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="h-4 w-4 rounded accent-[#008751]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
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
              Save Position
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
