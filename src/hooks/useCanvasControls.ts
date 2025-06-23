import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export interface CanvasControls {
  scale: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  isDrag: boolean;
  handleWheel: (e: React.WheelEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  resetView: () => void;
}

export const useCanvasControls = <T extends HTMLElement>(
  containerRef: RefObject<T>,
  canvasSize: { width: number; height: number }
): CanvasControls => {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  const setDefaultView = useCallback(() => {
    if (!containerRef.current) return;
    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();

    const newScale = 16; // Start with a default pixel size (e.g., 16x16)

    const newOffsetX = (containerWidth - canvasSize.width * newScale) / 2;
    const newOffsetY = (containerHeight - canvasSize.height * newScale) / 2;

    setScale(newScale);
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  }, [containerRef, canvasSize]);

  // İlk yüklemede canvas'ı ortala
  useEffect(() => {
    setDefaultView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const resetView = useCallback(() => {
    setDefaultView();
  }, [setDefaultView]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!containerRef.current) return;
      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.2, Math.min(20, scale * delta));
      const scaleChange = newScale / scale;

      setOffsetX(mouseX - (mouseX - offsetX) * scaleChange);
      setOffsetY(mouseY - (mouseY - offsetY) * scaleChange);
      setScale(newScale);
    },
    [scale, offsetX, offsetY, containerRef]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    setIsDrag(false);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffsetX((prev) => prev + dx);
      setOffsetY((prev) => prev + dy);
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      if (
        !isDrag &&
        Math.sqrt(
          (e.clientX - dragStartPos.current.x) ** 2 +
            (e.clientY - dragStartPos.current.y) ** 2
        ) > 5
      ) {
        setIsDrag(true);
      }
    },
    [isDragging, isDrag]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    scale,
    offsetX,
    offsetY,
    isDragging,
    isDrag,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
  };
}; 