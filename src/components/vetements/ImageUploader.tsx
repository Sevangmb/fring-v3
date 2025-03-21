
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "./schema/VetementFormSchema";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useDetection } from "@/hooks/useDetection";
import ImagePreviewArea from "./image-upload/ImagePreviewArea";
import DetectionResults from "./detection/DetectionResults";
import { Button } from "@/components/ui/button";
import DetectionButton from "./detection/DetectionButton";

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
    form.setValue('categorie', '');
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full mb-4">
        <ImagePreviewArea 
          imagePreview={imagePreview}
          loading={loading}
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
      
      {imagePreview && (
        <div className="flex gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={handleDeleteImage}
            disabled={loading}
          >
            Supprimer l'image
          </Button>
          <DetectionButton 
            onClick={detectImage}
            loading={loading}
            disabled={!imagePreview}
          />
        </div>
      )}
      
      <DetectionResults 
        error={error}
        steps={steps}
        currentStep={currentStep}
        loading={loading}
      />
    </div>
  );
};

export default ImageUploader;
