import { motion } from 'framer-motion';
import React from 'react';
import { Pixel as PixelType } from '../types';

interface PixelProps {
  pixelData?: PixelType;
  scale: number;
}

const Pixel: React.FC<PixelProps> = ({ pixelData, scale }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        backgroundColor: pixelData ? pixelData.color : '#FFFFFF',
        width: scale,
        height: scale,
      }}
      // Animasyonları kaldırdık, çünkü parent yönetecek
    />
  );
};

// React.memo, gereksiz yeniden render'ları önler
export default React.memo(Pixel); 