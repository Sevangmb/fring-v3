
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "./VetementFormFields";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useColorDetection } from "@/hooks/useColorDetection";
import ImagePreviewArea from "./ImagePreviewArea";
import ImageActions from "./ImageActions";
import DetectionErrorMessage from "./DetectionErrorMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/atoms/Typography";
import { Upload, AlertTriangle } from "lucide-react";

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
    handleDetectImage 
  } = useColorDetection(form, imagePreview);

  const handleDeleteImage = () => {
    setImagePreview(null);
    form.setValue('couleur', '');
    form.setValue('categorie', '');
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Zone de prévisualisation et d'upload */}
      <div className="w-full mb-4">
        <ImagePreviewArea 
          imagePreview={imagePreview}
          detectingColor={detectingColor}
          onClick={() => fileInputRef.current?.click()}
        />
        
        {!imagePreview && (
          <div 
            className="mt-4 flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="text-muted-foreground mb-2" />
            <Text className="text-muted-foreground text-center font-medium">
              Cliquez pour sélectionner une image
            </Text>
            <Text className="text-muted-foreground/70 text-xs text-center mt-1">
              Format PNG, JPG ou JPEG (max. 5 MB)
            </Text>
          </div>
        )}
      </div>
      
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      
      {/* Actions pour l'image (détection et suppression) */}
      <ImageActions 
        imagePreview={imagePreview}
        detectingColor={detectingColor}
        onDetect={handleDetectImage}
        onDelete={handleDeleteImage}
      />
      
      {/* Affichage des informations de détection */}
      {detectingColor && (
        <div className="w-full mt-4">
          <Text className="text-sm flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-24 rounded-full animate-pulse" /> 
            <span className="text-muted-foreground">Analyse en cours...</span>
          </Text>
          <Skeleton className="h-8 w-full rounded-sm animate-pulse" />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Skeleton className="h-6 rounded-sm animate-pulse" />
            <Skeleton className="h-6 rounded-sm animate-pulse" />
          </div>
        </div>
      )}
      
      {/* Message d'erreur et étapes de détection */}
      <DetectionErrorMessage 
        error={detectionError}
        steps={detectionSteps}
      />
    </div>
  );
};

export default ImageUploader;
