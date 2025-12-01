import { useState, useRef, useMemo } from "react";

export function useHoverPopup<T extends { id: string }>(items: T[]) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleItemMouseEnter = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredId(id);
  };

  const handleItemMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
    }, 300);
  };

  const handlePopupMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
    }, 300);
  };

  const hoveredItem = useMemo(
    () => items.find((item) => item.id === hoveredId),
    [items, hoveredId]
  );

  return {
    hoveredItem,
    handleItemMouseEnter,
    handleItemMouseLeave,
    handlePopupMouseEnter,
    handlePopupMouseLeave,
  };
}
