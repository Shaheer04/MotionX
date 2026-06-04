import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const GradientWipeScene: React.FC<any> = ({ scene, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wipe from 0% to 100% over the first 20 frames
  const wipeProgress = interpolate(frame, [0, 20], [0, 100], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: secondaryColor || '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: '60px', textAlign: 'center', position: 'relative' }}>
        
        {/* Base text (dull gray) */}
        <span style={{ 
          display: 'block',
          color: '#333333', 
          fontSize: '140px', 
          fontWeight: '900', 
          fontFamily: "'Outfit', sans-serif",
          textTransform: 'uppercase',
          textShadow: '0px 10px 30px rgba(0,0,0,0.8)'
        }}>
          {scene.copy_text}
        </span>

        {/* Highlighted text overlay with clip-path */}
        <span style={{ 
          position: 'absolute',
          left: '60px',
          top: '60px',
          right: '60px',
          color: primaryColor || '#ffffff', 
          fontSize: '140px', 
          fontWeight: '900', 
          fontFamily: "'Outfit', sans-serif",
          textTransform: 'uppercase',
          clipPath: `polygon(0 0, ${wipeProgress}% 0, ${wipeProgress}% 100%, 0% 100%)`,
          textShadow: '0px 10px 30px rgba(0,0,0,0.8)'
        }}>
          {scene.copy_text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
