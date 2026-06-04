import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const TypewriterScene: React.FC<any> = ({ scene, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = scene.copy_text;
  
  // Reveal one character every 2 frames
  const charsShown = Math.floor(frame / 2);
  const textToShow = text.substring(0, charsShown);

  return (
    <AbsoluteFill style={{ backgroundColor: secondaryColor || '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: '60px', width: '80%', textAlign: 'center' }}>
        <span style={{ 
          color: primaryColor || '#ffffff', 
          fontSize: '140px', 
          fontWeight: '900', 
          fontFamily: "'Outfit', sans-serif",
          textTransform: 'uppercase',
          lineHeight: '1.2',
          textShadow: '0px 10px 30px rgba(0,0,0,0.8)'
        }}>
          {textToShow}
          <span style={{ opacity: frame % 10 < 5 ? 1 : 0 }}>|</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
