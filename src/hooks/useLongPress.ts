import { useCallback, useRef } from "react";

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
}

export function useLongPress(
  callback: (e: React.MouseEvent | React.TouchEvent) => void,
  threshold: number,
  options: Partial<Options> = {},
) {
  const { onStart, onFinish, onCancel } = options;
  const timerId = useRef<number | null>(null);
  const isLongPressActive = useRef(false);
  const isPressed = useRef(false);

  const callbackRef = useRef(callback);
  const onStartRef = useRef(onStart);
  const onFinishRef = useRef(onFinish);
  const onCancelRef = useRef(onCancel);

  // Keep refs updated with latest callbacks
  callbackRef.current = callback;
  onStartRef.current = onStart;
  onFinishRef.current = onFinish;
  onCancelRef.current = onCancel;

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!isMouseEvent(event) && !isTouchEvent(event)) return;

      if (onStartRef.current) onStartRef.current(event);

      isPressed.current = true;
      timerId.current = window.setTimeout(() => {
        callbackRef.current(event);
        isLongPressActive.current = true;
      }, threshold);
    },
    [threshold],
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
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
  };
}
