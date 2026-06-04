import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const AmbientBackground: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create a slow breathing effect by oscillating scale
  const breathe = Math.sin((frame / fps) * 0.5) * 0.2 + 1; // Pulses between 0.8 and 1.2

  return (
    <AbsoluteFill style={{ backgroundColor: '#020202', overflow: 'hidden' }}>
      {/* Massive, highly visible vibrant glow optimized for extremely fast rendering */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150vw',
          height: '150vw',
          transform: `translate(-50%, -50%) scale(${breathe})`,
          background: `radial-gradient(circle at center, ${primaryColor} 0%, transparent 65%)`,
          opacity: 0.45, // No CSS blur filter used to maintain maximum rendering performance
        }}
      />
      {/* Dark vignette to ensure text remains perfectly readable */}
      <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)' 
      }} />
    </AbsoluteFill>
  );
};
