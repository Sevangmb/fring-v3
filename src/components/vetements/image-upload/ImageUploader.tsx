
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useDetection } from "@/hooks/useDetection";
import ImagePreviewArea from "./ImagePreviewArea";
import DetectionResults from "../detection/DetectionResults";

interface ImageUploaderProps {
  form: UseFormReturn<VetementFormValues>;
  user: any;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  form,
  user,
  imagePreview,
  setImagePreview
}) => {
  const { fileInputRef, handleImageChange } = useImageUpload(user, setImagePreview);
  const { 
    isDetecting,
    error,
    steps,
    currentStep,
    results,
    detectImage,
    detectAttributesFromImage,
    applyDetectionResults
  } = useDetection();

  const handleDeleteImage = () => {
    setImagePreview(null);
    form.setValue('couleur', '');
    form.setValue('categorie_id', 0);
    form.setValue('image_url', '');
  };

  const handleDetect = async () => {
    if (!imagePreview) return;

    try {
      // Convertir la string base64 ou URL en objet File
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });

      // Détecter les attributs de l'image
      const results = await detectAttributesFromImage(file);
      
      // Appliquer les résultats au formulaire si disponibles
      if (results) {
        applyDetectionResults(form, results);
      }
    } catch (err) {
      console.error("Erreur lors de la détection:", err);
    }
  };

  // Convertir DetectionStep[] en string[] pour corriger l'erreur de type
  const stepLabels = Array.isArray(steps) 
    ? steps.map(step => typeof step === 'string' ? step : step.label)
    : [];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full mb-4">
        <ImagePreviewArea 
          imagePreview={imagePreview}
          loading={isDetecting}
          onClick={() => fileInputRef.current?.click()}
          onDelete={imagePreview ? handleDeleteImage : undefined}
          onDetect={imagePreview ? handleDetect : undefined}
          detectingColor={isDetecting}
        />
      </div>
      
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      
      <DetectionResults 
        error={error || null}
        steps={stepLabels}
        currentStep={currentStep}
        loading={isDetecting}
      />
    </div>
  );
};

export default ImageUploader;
