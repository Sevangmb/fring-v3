
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";
import EtiquetteActions from "./EtiquetteActions";
import EtiquettePreview from "./EtiquettePreview";
import EtiquetteFields from "./EtiquetteFields";
import { useEtiquetteUpload } from "./useEtiquetteUpload";

interface EtiquetteUploaderProps {
  form: UseFormReturn<VetementFormValues>;
  user: any;
}

/**
 * Composant principal pour le téléchargement et l'analyse d'étiquettes de vêtements
 */
const EtiquetteUploader: React.FC<EtiquetteUploaderProps> = ({ form, user }) => {
  const {
    loading,
    imagePreview,
    fileInputRef,
    handleButtonClick,
    handleDeleteImage,
    handleAnalyzeEtiquette,
    handleImageChange
  } = useEtiquetteUpload(form, user);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <EtiquetteActions 
          loading={loading}
          onUploadClick={handleButtonClick}
          onCameraClick={() => {}}
        />
        
        <EtiquettePreview 
          imagePreview={imagePreview}
          loading={loading}
          onDelete={handleDeleteImage}
          onAnalyze={handleAnalyzeEtiquette}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      
      <EtiquetteFields form={form} />
    </div>
  );
};

export default EtiquetteUploader;
