import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiMaximize, FiRefreshCcw } from 'react-icons/fi';
import { useCanvasControls } from '../hooks/useCanvasControls';
import { useGameStore } from '../store/teamStore';
import { supabase } from '../supabaseClient';
import { Pixel, Team } from '../types';
import { getTeamColor, getTeamName } from '../utils/colors';

const Canvas: React.FC = () => {
  const { 
    pixels, 
    canvasSize, 
    openPaintModal, 
    setPixel 
  } = useGameStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useCanvasControls(
    containerRef as React.RefObject<HTMLDivElement>,
    canvasSize
  );
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('pixel-updates')
      .on<Pixel>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pixels' },
        (payload) => {
          console.log('Change received!', payload);
          const newDbPixel = payload.new as { x: number; y: number; team_name: Team; updated_at: string; };
          const newPixel: Pixel = {
            x: newDbPixel.x,
            y: newDbPixel.y,
            team: newDbPixel.team_name,
            last_painted_at: newDbPixel.updated_at
          };
          setPixel(newPixel);
        }
      )
      .subscribe((status, err) => {
        console.log('Realtime subscription status:', status);
        if (err) {
          console.error('Realtime subscription error:', err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setPixel]);

  const pixelsMap = useMemo(() => {
    const map = new Map<string, Pixel>();
    pixels.forEach((p) => map.set(`${p.x},${p.y}`, p));
    return map;
  }, [pixels]);

  const [viewport, setViewport] = useState({
    startCol: 0,
    endCol: 0,
    startRow: 0,
    endRow: 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();

      const startCol = Math.max(0, Math.floor(-controls.offsetX / controls.scale));
      const endCol = Math.min(canvasSize.width, Math.ceil((-controls.offsetX + width) / controls.scale));
      const startRow = Math.max(0, Math.floor(-controls.offsetY / controls.scale));
      const endRow = Math.min(canvasSize.height, Math.ceil((-controls.offsetY + height) / controls.scale));

      setViewport({ startCol, endCol, startRow, endRow });
    };

    updateViewport();
  }, [controls.scale, controls.offsetX, controls.offsetY, canvasSize]);

  const getPixelFromMouse = (e: React.MouseEvent) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - controls.offsetX) / controls.scale);
    const y = Math.floor((e.clientY - rect.top - controls.offsetY) / controls.scale);

    if (x >= 0 && x < canvasSize.width && y >= 0 && y < canvasSize.height) {
      return { x, y };
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    controls.handleMouseMove(e);
    if (!controls.isDragging) {
      setHoveredPixel(getPixelFromMouse(e));
    }
  };

  const handleMouseLeave = () => setHoveredPixel(null);

  const handlePixelClick = (e: React.MouseEvent) => {
    if (controls.isDrag) return;
    const pixel = getPixelFromMouse(e);
    if (pixel) {
      openPaintModal(pixel.x, pixel.y);
    }
  };

  const visiblePixels = useMemo(() => {
    const elements = [];
    for (let y = viewport.startRow; y < viewport.endRow; y++) {
      for (let x = viewport.startCol; x < viewport.endCol; x++) {
        const pixelData = pixelsMap.get(`${x},${y}`);
        if (pixelData) {
          elements.push({ x, y, key: `${x}-${y}`, pixelData });
        }
      }
    }
    return elements;
  }, [viewport, pixelsMap]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative touch-none"
      onWheel={controls.handleWheel}
      onMouseDown={controls.handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={controls.handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handlePixelClick}
      style={{
        cursor: controls.isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        className="absolute top-0 left-0 pointer-events-none bg-white shadow-2xl shadow-black/20"
        style={{
          width: canvasSize.width * controls.scale,
          height: canvasSize.height * controls.scale,
          transform: `translate(${controls.offsetX}px, ${controls.offsetY}px)`,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${controls.scale}px ${controls.scale}px`,
        }}
      >
        {/* Sadece boyanmış pikselleri render et */}
        {visiblePixels.map(({ x, y, key, pixelData }) => (
          <div
            key={key}
            className="absolute"
            style={{
              left: x * controls.scale,
              top: y * controls.scale,
              width: controls.scale,
              height: controls.scale,
              backgroundColor: getTeamColor(pixelData.team),
            }}
          />
        ))}

        {/* Hovered Pixel Vurgusu */}
        {hoveredPixel && (
          <div
            className="absolute transition-transform duration-150 ease-in-out"
            style={{
              left: hoveredPixel.x * controls.scale,
              top: hoveredPixel.y * controls.scale,
              width: controls.scale,
              height: controls.scale,
              boxShadow: '0 0 0 2px black, inset 0 0 0 2px white',
              transform: 'scale(1.2)',
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* UI Overlays */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2 items-start">
        <div className="bg-slate-50 p-2 rounded-lg shadow-lg text-sm font-medium text-slate-700 flex items-center">
          <FiMaximize className="mr-2 text-slate-500" />
          <span>Zoom: {Math.round(controls.scale * 100)}%</span>
        </div>
        <button
          onClick={controls.resetView}
          className="bg-slate-50 p-2 rounded-lg shadow-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700 flex items-center"
        >
          <FiRefreshCcw className="mr-2" />
          <span>Reset View</span>
        </button>
      </div>
      
      {/* Tooltip */}
      {hoveredPixel && (
        <div
          className="absolute z-20 pointer-events-none bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg"
          style={{
            transform: `translate(${
              hoveredPixel.x * controls.scale + controls.offsetX + 20
            }px, ${
              hoveredPixel.y * controls.scale + controls.offsetY + 20
            }px)`,
          }}
        >
          X: {hoveredPixel.x}, Y: {hoveredPixel.y}
          {pixelsMap.has(`${hoveredPixel.x},${hoveredPixel.y}`) && (
            <span className="ml-2">
              - {getTeamName(pixelsMap.get(`${hoveredPixel.x},${hoveredPixel.y}`)!.team as Team)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Canvas; 