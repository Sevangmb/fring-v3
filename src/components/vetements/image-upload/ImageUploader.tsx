
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";
import ImagePreviewArea from "./ImagePreviewArea";
import DetectionResults from "../detection/DetectionResults";
import { useImageUploader } from "@/hooks/useImageUploader";
import ImageActions from "./ImageActions";

interface ImageUploaderProps {
  form: UseFormReturn<VetementFormValues>;
  user: any;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Composant principal pour le téléchargement et l'analyse d'images de vêtements
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  form,
  user,
  imagePreview,
  setImagePreview
}) => {
  const {
    fileInputRef,
    loading,
    error,
    steps,
    currentStep,
    handleImageChange,
    handleOpenFileSelector,
    handleDeleteImage,
    detectImage
  } = useImageUploader(form, user, imagePreview, setImagePreview);

  return (
    <div className="flex flex-col items-center w-full">
      <ImageActions 
        onUploadClick={handleOpenFileSelector} 
        loading={loading}
      />
      
      <div className="w-full mb-4">
        <ImagePreviewArea 
          imagePreview={imagePreview}
          loading={loading}
          onClick={handleOpenFileSelector}
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
        // Converting the steps array to the expected format
        steps={steps?.map(step => step.label)}
        currentStep={currentStep}
        loading={loading}
      />
    </div>
  );
};

export default ImageUploader;
