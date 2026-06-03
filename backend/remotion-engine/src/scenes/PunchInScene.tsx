import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const PunchInScene: React.FC<any> = ({ scene, screenshotUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const durationFrames = scene.duration_seconds * fps;

  // Gentle scale up over the whole scene to keep it fully in frame
  const scale = interpolate(frame, [0, durationFrames], [0.85, 0.95], {
    extrapolateRight: 'clamp',
  });

  // Very subtle Rotate Y (left side closer)
  const rotateY = interpolate(frame, [0, durationFrames], [15, 5], {
    extrapolateRight: 'clamp',
  });
  
  // Very subtle Rotate X (looking slightly down)
  const rotateX = interpolate(frame, [0, durationFrames], [10, 0], {
    extrapolateRight: 'clamp',
  });

  // Scroll effect (move image up smoothly over the whole scene)
  const scrollY = interpolate(frame, [0, durationFrames], [0, -40], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', perspective: '2000px' }}>
        
        {/* 3D Tilted Screenshot Window (No Text) */}
        {screenshotUrl && (
            <div style={{ 
                width: '85%', 
                height: '80%', // Fixed height creates a realistic browser window
                transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: 'preserve-3d',
                borderRadius: '16px', 
                boxShadow: '-20px 40px 100px rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
                overflow: 'hidden',
                backgroundColor: '#1e1e1e'
            }}>
                {/* macOS style browser top bar */}
                <div style={{ width: '100%', height: '40px', backgroundColor: '#1e1e1e', display: 'flex', alignItems: 'center', paddingLeft: '20px', gap: '10px', flexShrink: 0, position: 'relative', zIndex: 10 }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </div>
                
                {/* Scrollable image container */}
                <div style={{ width: '100%', height: 'calc(100% - 40px)', overflow: 'hidden' }}>
                    <Img 
                        src={screenshotUrl} 
                        style={{ 
                            width: '100%', 
                            display: 'block',
                            transform: `translateY(${scrollY}%)`
                        }} 
                    />
                </div>
            </div>
        )}
        
    </AbsoluteFill>
  );
};
