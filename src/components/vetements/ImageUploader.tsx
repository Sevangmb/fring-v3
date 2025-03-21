
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "./schema/VetementFormSchema";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useColorDetection } from "@/hooks/useColorDetection";
import ImagePreviewArea from "./image-upload/ImagePreviewArea";
import ImageActions from "./image-upload/ImageActions";
import DetectionErrorMessage from "./image-upload/DetectionErrorMessage";

interface ImageUploaderProps {
  form: UseFormReturn<VetementFormValues>;
  user: any;
  detectingColor: boolean;
  setDetectingColor: React.Dispatch<React.SetStateAction<boolean>>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  form,
  user,
  detectingColor,
  setDetectingColor,
  imagePreview,
  setImagePreview
}) => {
  const { fileInputRef, handleImageChange } = useImageUpload(user, setImagePreview);
  
  const { 
    detectionError, 
    detectionSteps,
    currentStep,
    handleDetectImage 
  } = useColorDetection(form, imagePreview);

  const handleDeleteImage = () => {
    setImagePreview(null);
    form.setValue('couleur', '');
    form.setValue('categorie', '');
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full mb-4">
        <ImagePreviewArea 
          imagePreview={imagePreview}
          detectingColor={detectingColor}
          onClick={() => fileInputRef.current?.click()}
        />
      </div>
      
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      
      <ImageActions 
        imagePreview={imagePreview}
        detectingColor={detectingColor}
        onDetect={handleDetectImage}
        onDelete={handleDeleteImage}
      />
      
      <DetectionErrorMessage 
        error={detectionError}
        steps={detectionSteps}
        currentStep={currentStep}
      />
    </div>
  );
};

export default ImageUploader;
