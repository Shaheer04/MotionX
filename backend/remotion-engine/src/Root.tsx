import React from 'react';
import { Composition, getInputProps } from 'remotion';
import { MainSequence } from './MainSequence';

const defaultProps = {
  product_name: "Test Product",
  tagline: "The best product",
  brand_color_primary: "#FF0000",
  brand_color_secondary: "#000000",
  scenes: [
    {
      title: "Scene 1",
      copy_text: "Welcome to the future",
      screenshot_index: 0,
      duration_seconds: 5,
      animation_type: "zoom"
    }
  ]
};

export const RemotionRoot: React.FC = () => {
  const props = getInputProps();
  const compositionProps = Object.keys(props).length > 0 ? props : defaultProps;
  
  const fps = 30;
  const defaultDurationInFrames = 300;
  let totalDurationFrames = 0;
  
  if (compositionProps.scenes && Array.isArray(compositionProps.scenes)) {
    totalDurationFrames = Math.ceil(
      compositionProps.scenes.reduce((acc: number, scene: any) => acc + (scene.duration_seconds || 5), 0) * fps
    );
  }
  
  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@900&display=swap');`}
      </style>
      <Composition
        id="Main"
        component={MainSequence}
        durationInFrames={totalDurationFrames > 0 ? totalDurationFrames : defaultDurationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={compositionProps}
      />
    </>
  );
};
