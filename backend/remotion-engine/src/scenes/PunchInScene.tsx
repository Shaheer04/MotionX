import React from 'react';
import { AbsoluteFill, Img, interpolate, Easing, useCurrentFrame, useVideoConfig } from 'remotion';

export const PunchInScene: React.FC<any> = ({ scene, screenshotUrl, primaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const durationFrames = scene.duration_seconds * fps;

  // Static scale, pushed closer to the camera
  const scale = 0.95;

  // Static Isometric Tilt Geometry
  const rotateY = -22;
  const rotateX = 12;
  const rotateZ = 3;

  // Slow-mo linear scroll effect
  const scrollY = interpolate(frame, [0, durationFrames], [0, -20], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', perspective: '2500px' }}>
        
        {/* 3D Tilted Screenshot Window */}
        {screenshotUrl && (
            <div style={{ 
                width: '85%', 
                height: '80%', 
                transform: `translateX(-5%) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                transformStyle: 'preserve-3d',
                borderRadius: '16px', 
                boxShadow: `0px 10px 40px rgba(0,0,0,0.8), 0px 0px 80px 20px ${primaryColor}`,
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
