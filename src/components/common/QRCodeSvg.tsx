import React from 'react';

interface QRCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Deterministic SVG QR Code Generator Pattern
 * Generates an authentic matrix grid based on hash input string
 */
export const QRCodeSvg: React.FC<QRCodeSvgProps> = ({ value, size = 140, className = '' }) => {
  // Generate deterministic 21x21 QR-like matrix grid from string hash
  const gridSize = 21;
  const matrix: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  // Finder patterns (top-left, top-right, bottom-left 7x7 squares)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(gridSize - 7, 0);
  drawFinder(0, gridSize - 7);

  // Timing patterns
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Fill pseudo-random data bits based on input value
  let hashVal = 0;
  for (let i = 0; i < value.length; i++) {
    hashVal = (hashVal << 5) - hashVal + value.charCodeAt(i);
    hashVal |= 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= gridSize - 8;
      const inBottomLeft = r >= gridSize - 8 && c < 8;
      if (!inTopLeft && !inTopRight && !inBottomLeft) {
        const bit = ((hashVal ^ (r * 31 + c * 17)) >>> ((r + c) % 16)) & 1;
        matrix[r][c] = bit === 1;
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div className={`inline-block p-2 bg-white rounded-lg border border-slate-200 ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {matrix.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#0f172a"
                rx={cellSize > 6 ? 1 : 0}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
