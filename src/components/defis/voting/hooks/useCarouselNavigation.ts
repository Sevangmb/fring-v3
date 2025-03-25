
import { useState, useCallback } from "react";

export const useCarouselNavigation = (initialMaxItems: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxItems, setMaxItems] = useState(initialMaxItems);

  const navigatePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const navigateNext = useCallback(() => {
    if (currentIndex < maxItems - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, maxItems]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < maxItems) {
      setCurrentIndex(index);
    }
  }, [maxItems]);

  return {
    currentIndex,
    navigatePrevious,
    navigateNext,
    goToIndex,
    setMaxItems
  };
};
