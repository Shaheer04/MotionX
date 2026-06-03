import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SlideInScene: React.FC<any> = ({ scene, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = scene.copy_text.split(' ');

  return (
    <AbsoluteFill style={{ backgroundColor: secondaryColor || '#111111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', padding: '40px' }}>
        {words.map((word: string, i: number) => {
          const delay = i * 4;
          const yOffset = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 14,
              stiffness: 150,
            },
            from: 200,
            to: 0,
          });

          return (
            <div key={i} style={{ overflow: 'hidden', paddingBottom: '20px' }}>
               <span style={{ 
                  transform: `translateY(${yOffset}px)`, 
                  display: 'inline-block',
                  color: primaryColor || '#ffffff', 
                  fontSize: '140px', 
                  fontWeight: '900', 
                  fontFamily: "'Outfit', sans-serif",
                  textTransform: 'uppercase'
                }}>
                  {word}
                </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
