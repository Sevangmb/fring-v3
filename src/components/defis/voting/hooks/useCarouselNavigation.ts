
import { useState } from "react";

export const useCarouselNavigation = (itemsCount: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigatePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const navigateNext = () => {
    setCurrentIndex(prev => (prev < itemsCount - 1 ? prev + 1 : prev));
  };

  return {
    currentIndex,
    navigatePrevious,
    navigateNext,
    setCurrentIndex
  };
};
