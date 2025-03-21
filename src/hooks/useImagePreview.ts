
import { useState } from "react";

/**
 * Hook to manage image preview state
 */
export const useImagePreview = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectingColor, setDetectingColor] = useState(false);

  const handleDeleteImage = (formReset: () => void) => {
    setImagePreview(null);
    formReset();
  };

  return {
    imagePreview,
    setImagePreview,
    detectingColor,
    setDetectingColor,
    handleDeleteImage
  };
};
