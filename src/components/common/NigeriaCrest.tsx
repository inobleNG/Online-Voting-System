import React from 'react';

interface NigeriaCrestProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const NigeriaCrest: React.FC<NigeriaCrestProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className={sizeMap[size]}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Seal Frame */}
        <circle cx="100" cy="100" r="94" stroke="#008751" strokeWidth="3" fill="#FFFFFF" />
        <circle cx="100" cy="100" r="88" stroke="#005A36" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Shield background (Black shield) */}
        <path
          d="M 68 55 Q 100 45 132 55 L 132 105 Q 132 145 100 162 Q 68 145 68 105 Z"
          fill="#0B0E0D"
          stroke="#008751"
          strokeWidth="2"
        />

        {/* Silver Pall / 'Y' River Niger & Benue */}
        <path
          d="M 72 56 L 94 92 L 94 158 Q 100 162 106 158 L 106 92 L 128 56 L 118 56 L 100 85 L 82 56 Z"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="0.5"
        />

        {/* Left Supporter Horse (White) */}
        <path
          d="M 66 125 C 55 110 42 90 48 68 C 52 56 60 52 64 62 C 60 74 62 86 68 94 C 70 82 66 70 64 62 C 62 58 56 50 48 54 C 40 58 36 72 40 92 C 44 112 56 130 66 142 Z"
          fill="#F8FAFC"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />

        {/* Right Supporter Horse (White) */}
        <path
          d="M 134 125 C 145 110 158 90 152 68 C 148 56 140 52 136 62 C 140 74 138 86 132 94 C 130 82 134 70 136 62 C 138 58 144 50 152 54 C 160 58 164 72 160 92 C 156 112 144 130 134 142 Z"
          fill="#F8FAFC"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />

        {/* Wreath on top (Green and White) */}
        <rect x="85" y="44" width="30" height="7" rx="3.5" fill="#008751" stroke="#FFFFFF" strokeWidth="1" />
        <rect x="92" y="44" width="16" height="7" fill="#FFFFFF" />

        {/* Red Eagle standing on wreath */}
        <path
          d="M 100 24 C 94 28 88 32 86 42 L 114 42 C 112 32 106 28 100 24 Z"
          fill="#B91C1C"
        />
        <path
          d="M 100 20 C 104 24 108 26 102 34 L 98 34 C 92 26 96 24 100 20 Z"
          fill="#DC2626"
        />

        {/* Base Cocto / Ground with Green Flora */}
        <ellipse cx="100" cy="165" rx="55" ry="12" fill="#008751" stroke="#005A36" strokeWidth="1" />
        <circle cx="85" cy="165" r="3" fill="#A7F3D0" />
        <circle cx="100" cy="166" r="3.5" fill="#A7F3D0" />
        <circle cx="115" cy="165" r="3" fill="#A7F3D0" />

        {/* Motto Ribbon Banner */}
        <path
          d="M 45 178 Q 100 170 155 178 L 150 188 Q 100 180 50 188 Z"
          fill="#E8F5EE"
          stroke="#008751"
          strokeWidth="1"
        />
        <text
          x="100"
          y="185"
          textAnchor="middle"
          fill="#032E1C"
          fontSize="5.5"
          fontWeight="bold"
          fontFamily="serif"
          letterSpacing="0.6"
        >
          UNITY AND FAITH, PEACE AND PROGRESS
        </text>
      </svg>

      {showText && (
        <div className="mt-1 text-center">
          <p className="font-crest text-[10px] tracking-widest text-[#008751] uppercase font-bold">
            Federal Republic of Nigeria
          </p>
          <p className="text-[8px] text-[#4A6356] font-mono uppercase">
            Electoral Integrity &amp; Ballot System
          </p>
        </div>
      )}
    </div>
  );
};

export const NigeriaFlag: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 24,
  height = 16,
}) => {
  return (
    <div
      className={`inline-flex rounded-xs overflow-hidden border border-[#008751] ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="flex-1 bg-[#008751]" />
      <div className="flex-1 bg-[#FFFFFF]" />
      <div className="flex-1 bg-[#008751]" />
    </div>
  );
};

