import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  lighthouseColor?: string;
  sunbeamColor?: string;
  waveColor?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 40,
  lighthouseColor = '#083D41', // Dark teal
  sunbeamColor = '#FFC72C',      // Yellow/Gold
  waveColor = '#00B2E2',         // Cyan
}) => {
  // 11 sun rays radiating from (50, 58)
  // Semicircle layout from 15 to 165 degrees
  const rays = Array.from({ length: 11 }, (_, i) => {
    // Angles distributed from 165 down to 15 degrees
    const angleDeg = 165 - i * 15;
    const angleRad = (angleDeg * Math.PI) / 180;
    
    const rInner = 24;
    const rOuter = 40;
    
    // Half-width angle of each ray
    const halfWidth = 0.05; // radians (approx 3 degrees)
    
    const x1 = 50 + rInner * Math.cos(angleRad - halfWidth);
    const y1 = 58 - rInner * Math.sin(angleRad - halfWidth);
    
    const x2 = 50 + rOuter * Math.cos(angleRad - halfWidth * 1.2);
    const y2 = 58 - rOuter * Math.sin(angleRad - halfWidth * 1.2);
    
    const x3 = 50 + rOuter * Math.cos(angleRad + halfWidth * 1.2);
    const y3 = 58 - rOuter * Math.sin(angleRad + halfWidth * 1.2);
    
    const x4 = 50 + rInner * Math.cos(angleRad + halfWidth);
    const y4 = 58 - rInner * Math.sin(angleRad + halfWidth);
    
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} L ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sunbeams */}
      <g>
        {rays.map((pathData, idx) => (
          <path
            key={idx}
            d={pathData}
            fill={sunbeamColor}
          />
        ))}
      </g>

      {/* Lighthouse Body */}
      <g>
        {/* Base (slightly curved inwards) */}
        <path
          d="M 42 76 Q 46.5 60 46.5 42 L 53.5 42 Q 53.5 60 58 76 Z"
          fill={lighthouseColor}
        />
        
        {/* Balcony/Platform */}
        <path
          d="M 43.5 42 L 56.5 42 L 56.5 39.5 L 43.5 39.5 Z"
          fill={lighthouseColor}
        />
        
        {/* Lantern Room Tower */}
        <path
          d="M 46.5 39.5 L 53.5 39.5 L 53.5 33 L 46.5 33 Z"
          fill={lighthouseColor}
        />
        
        {/* Lantern Room Windows (Glowing Yellow Columns) */}
        <rect x="47.5" y="34.5" width="1" height="3" fill={sunbeamColor} rx="0.3" />
        <rect x="49.5" y="34.5" width="1" height="3" fill={sunbeamColor} rx="0.3" />
        <rect x="51.5" y="34.5" width="1" height="3" fill={sunbeamColor} rx="0.3" />
        
        {/* Dome Roof */}
        <path
          d="M 45.5 33 Q 50 27 54.5 33 Z"
          fill={lighthouseColor}
        />
        
        {/* Spire/Finial */}
        <line
          x1="50"
          y1="27.5"
          x2="50"
          y2="25"
          stroke={lighthouseColor}
          strokeWidth="0.8"
        />
        <circle
          cx="50"
          cy="24.5"
          r="0.8"
          fill={lighthouseColor}
        />
      </g>

      {/* Blue/Cyan Waves */}
      <path
        d="M 32 74 C 42 61.5 48 57 48 57 C 48 57 52.5 63 48.5 71 C 44 79.5 52 83.5 60 79.5 C 67 76 72 79.5 75.5 81.5 C 70.5 89.5 52.5 93 32 74 Z"
        fill={waveColor}
      />
    </svg>
  );
};
