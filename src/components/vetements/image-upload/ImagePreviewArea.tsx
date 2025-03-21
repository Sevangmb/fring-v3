
import React from "react";
import { Camera, Image } from "lucide-react";

interface ImagePreviewAreaProps {
  imagePreview: string | null;
  loading: boolean;
  onClick: () => void;
}

const ImagePreviewArea: React.FC<ImagePreviewAreaProps> = ({ 
  imagePreview, 
  loading,
  onClick 
}) => {
  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer
        ${imagePreview ? 'border-transparent' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}`}
      onClick={onClick}
    >
      {imagePreview ? (
        <>
          <img 
            src={imagePreview} 
            alt="Aperçu du vêtement" 
            className={`w-full h-full object-cover rounded-lg ${loading ? 'opacity-50' : ''}`}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
          )}
        </>
      ) : (
        <>
          <Camera className="w-10 h-10 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground text-center px-4">
            Cliquez pour ajouter une image du vêtement
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2 text-center px-4">
            Format JPG ou PNG, max 5MB
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePreviewArea;
