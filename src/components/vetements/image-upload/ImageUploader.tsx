
import React from "react";
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
    loading,
    error,
    steps,
    currentStep,
    detectImage
  } = useDetection(form, imagePreview);

  const handleDeleteImage = () => {
    setImagePreview(null);
    form.setValue('couleur', '');
    form.setValue('categorie_id', 0);
    form.setValue('image_url', '');
  };

  // Convertir DetectionStep[] en string[] pour corriger l'erreur de type
  const stepLabels = steps.map(step => typeof step === 'string' ? step : step.label);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full mb-4">
        <ImagePreviewArea 
          imagePreview={imagePreview}
          loading={loading}
          onClick={() => fileInputRef.current?.click()}
          onDelete={imagePreview ? handleDeleteImage : undefined}
          onDetect={imagePreview ? detectImage : undefined}
          detectingColor={loading}
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
        error={error}
        steps={stepLabels}
        currentStep={currentStep}
        loading={loading}
      />
    </div>
  );
};

export default ImageUploader;
