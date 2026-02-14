import { useCallback, useRef, useState } from "react";

function isTouchEvent(e: React.SyntheticEvent) {
  return window.TouchEvent
    ? e.nativeEvent instanceof TouchEvent
    : "touches" in e.nativeEvent;
}

function isMouseEvent(event: React.SyntheticEvent) {
  return event.nativeEvent instanceof MouseEvent;
}

interface Options {
  onStart: (e: React.MouseEvent | React.TouchEvent) => void;
  onFinish: (e: React.MouseEvent | React.TouchEvent) => void;
  onCancel: (e: React.MouseEvent | React.TouchEvent) => void;
  fps?: number; // Frames per second for progress updates (default: 60)
}

export function useLongPress(
  callback: (e: React.MouseEvent | React.TouchEvent) => void,
  threshold: number,
  options: Partial<Options> = {},
) {
  const { onStart, onFinish, onCancel, fps = 60 } = options;
  const [progress, setProgress] = useState(0);
  const timerId = useRef<number | null>(null);
  const progressTimerId = useRef<number | null>(null);
  const isLongPressActive = useRef(false);
  const isPressed = useRef(false);
  const startTimeRef = useRef<number>(0);

  // Keep refs updated with latest callbacks
  const callbackRef = useRef(callback);
  const onStartRef = useRef(onStart);
  const onFinishRef = useRef(onFinish);
  const onCancelRef = useRef(onCancel);

  callbackRef.current = callback;
  onStartRef.current = onStart;
  onFinishRef.current = onFinish;
  onCancelRef.current = onCancel;

  const updateProgress = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const percentage = Math.min((elapsed / threshold) * 100, 100);
    setProgress(percentage);

    if (percentage < 100) {
      const frameDelay = 1000 / fps; // milliseconds per frame
      progressTimerId.current = window.setTimeout(updateProgress, frameDelay);
    }
  }, [threshold, fps]);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!isMouseEvent(event) && !isTouchEvent(event)) return;

      if (onStartRef.current) onStartRef.current(event);

      isPressed.current = true;
      startTimeRef.current = Date.now();
      setProgress(0);

      // Start progress updates at specified FPS
      updateProgress();

      timerId.current = window.setTimeout(() => {
        callbackRef.current(event);
        isLongPressActive.current = true;
        setProgress(100);
      }, threshold);
    },
    [threshold, updateProgress],
  );

  const cancel = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isMouseEvent(event) && !isTouchEvent(event)) return;

    if (isLongPressActive.current && onFinishRef.current) {
      onFinishRef.current(event);
    } else if (isPressed.current && onCancelRef.current) {
      onCancelRef.current(event);
    }

    isLongPressActive.current = false;
    isPressed.current = false;

    if (timerId.current) window.clearTimeout(timerId.current);
    if (progressTimerId.current) window.clearTimeout(progressTimerId.current);

    setProgress(0);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
    progress, // 0-100 percentage of threshold completion
  };
}
