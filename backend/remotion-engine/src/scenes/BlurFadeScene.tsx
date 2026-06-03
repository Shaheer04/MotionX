import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const BlurFadeScene: React.FC<any> = ({ scene, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade and unblur over the first 15 frames
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const blur = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: secondaryColor || '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <span style={{ 
          color: primaryColor || '#ffffff', 
          fontSize: '140px', 
          fontWeight: '900', 
          fontFamily: "'Outfit', sans-serif",
          textTransform: 'uppercase',
          opacity: opacity,
          filter: `blur(${blur}px)`
        }}>
          {scene.copy_text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
