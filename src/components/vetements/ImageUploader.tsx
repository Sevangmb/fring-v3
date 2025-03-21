
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "./VetementFormFields";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useColorDetection } from "@/hooks/useColorDetection";
import ImagePreviewArea from "./ImagePreviewArea";
import ImageActions from "./ImageActions";
import DetectionErrorMessage from "./DetectionErrorMessage";

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
    handleDetectImage 
  } = useColorDetection(form, imagePreview);

  const handleDeleteImage = () => {
    setImagePreview(null);
    form.setValue('couleur', '');
    form.setValue('categorie', '');
  };

  return (
    <div className="flex flex-col items-center">
      <ImagePreviewArea 
        imagePreview={imagePreview}
        detectingColor={detectingColor}
        onClick={() => fileInputRef.current?.click()}
      />
      
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      
      <DetectionErrorMessage error={detectionError} />
      
      <ImageActions 
        imagePreview={imagePreview}
        detectingColor={detectingColor}
        onDetect={handleDetectImage}
        onDelete={handleDeleteImage}
      />
    </div>
  );
};

export default ImageUploader;
