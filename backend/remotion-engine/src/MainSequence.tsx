import React from 'react';
import { Sequence, AbsoluteFill, Img, useVideoConfig, useCurrentFrame, interpolate } from 'remotion';
import { SlideInScene } from './scenes/SlideInScene';
import { TypewriterScene } from './scenes/TypewriterScene';
import { BlurFadeScene } from './scenes/BlurFadeScene';
import { GradientWipeScene } from './scenes/GradientWipeScene';
import { PunchInScene } from './scenes/PunchInScene';
import { AmbientBackground } from './scenes/AmbientBackground';

const ContinuousZoom: React.FC<{ children: React.ReactNode, durationInFrames: number }> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  // Slow zoom in from 1 to 1.15 over the duration of the scene
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateRight: 'clamp'
  });
  return <AbsoluteFill style={{ transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
};

export const MainSequence: React.FC<any> = ({ scenes, brand_color_primary, screenshot_urls }) => {
  const { fps } = useVideoConfig();
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
      {scenes.map((scene: any, index: number) => {
        const durationFrames = Math.ceil((scene.duration_seconds || 2) * fps);
        const startFrame = currentFrame;
        currentFrame += durationFrames;

        const screenshotUrl = screenshot_urls ? screenshot_urls[scene.screenshot_index] : null;

        if (scene.animation_type === 'punch-in') {
            return (
              <Sequence key={index} from={startFrame} durationInFrames={durationFrames}>
                 <AmbientBackground primaryColor={brand_color_primary} />
                 <PunchInScene 
                   scene={scene} 
                   primaryColor={brand_color_primary} 
                   screenshotUrl={screenshotUrl} 
                 />
              </Sequence>
            );
        }

        let SceneComponent = SlideInScene;
        if (scene.animation_type === 'typewriter') SceneComponent = TypewriterScene;
        if (scene.animation_type === 'blur-fade') SceneComponent = BlurFadeScene;
        if (scene.animation_type === 'gradient-wipe') SceneComponent = GradientWipeScene;
        
        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationFrames}>
               <AmbientBackground primaryColor={brand_color_primary} />
               <SceneComponent 
                 scene={scene} 
                 primaryColor={brand_color_primary} 
                 secondaryColor="transparent" 
               />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
