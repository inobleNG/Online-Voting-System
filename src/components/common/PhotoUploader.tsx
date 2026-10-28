import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface PhotoUploaderProps {
  currentPhotoUrl: string;
  onPhotoChange: (base64OrUrl: string) => void;
  label?: string;
  helperText?: string;
  shape?: 'square' | 'circle';
  size?: 'sm' | 'md' | 'lg';
}

const SAMPLE_NIGERIAN_PORTRAITS = [
  {
    name: 'Senator Profile (Male)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Official Profile (Female)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Candidate Profile (Male)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Candidate Profile (Female)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentPhotoUrl,
  onPhotoChange,
  label = 'Official Passport Photograph',
  helperText = 'Upload a clear white-background passport photo (JPG/PNG, max 4MB)',
  shape = 'square',
  size = 'md',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  const handleFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files (JPG, PNG, WEBP) are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onPhotoChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#00683E] font-crest tracking-wide">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-[11px] font-mono text-[#008751] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>{showPresets ? 'Close Presets' : 'Sample Photos'}</span>
        </button>
      </div>

      {showPresets && (
        <div className="p-3 bg-[#F0F8F3] border border-[#C2E0D0] rounded-xl space-y-2">
          <p className="text-[10px] font-mono text-[#4A6356] uppercase font-bold">
            Click a certified preset passport photograph:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SAMPLE_NIGERIAN_PORTRAITS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onPhotoChange(p.url);
                  setShowPresets(false);
                }}
                className={`relative group rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  currentPhotoUrl === p.url ? 'border-[#008751] ring-2 ring-[#008751]' : 'border-[#D2E4D9] hover:border-[#008751]'
                }`}
              >
                <img src={p.url} alt={p.name} className="w-full h-14 object-cover" />
                {currentPhotoUrl === p.url && (
                  <div className="absolute inset-0 bg-[#008751]/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-[#F8FAF8] border border-[#D2E4D9] rounded-xl">
        {/* Photo Preview */}
        <div
          className={`relative ${sizeClasses[size]} shrink-0 overflow-hidden bg-white border ${
            dragActive ? 'border-[#008751] bg-[#E8F5EE]' : 'border-slate-300'
          } ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} flex items-center justify-center group`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Passport Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#64748B] p-2 text-center">
              <Camera className="w-6 h-6 text-[#008751] mb-1" />
              <span className="text-[9px] font-mono leading-tight">No Photo</span>
            </div>
          )}

          {/* Hover overlay */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-[#0F291E]/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity"
          >
            <Camera className="w-4 h-4 mb-0.5 text-white" />
            <span>Change</span>
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2 text-left w-full sm:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#008751] hover:bg-[#007043] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select Photo File</span>
            </button>

            {currentPhotoUrl && (
              <button
                type="button"
                onClick={() => onPhotoChange('')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs rounded-lg border border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#4A6356] leading-relaxed">
            {helperText}
          </p>

          {uploadError && (
            <p className="text-[11px] text-rose-600 font-mono font-medium">
              ⚠ {uploadError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

