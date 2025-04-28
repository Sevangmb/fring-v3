
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { FileText, Info, Tag, CircleDollarSign } from "lucide-react";
import { useVetementForm } from "@/hooks/useVetementForm";
import VetementFormFields from "./VetementFormFields";
import { VetementFormValues } from "./schema/VetementFormSchema";
import ImageUploader from "./image-upload/ImageUploader";
import FormActions from "./FormActions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface VetementFormContainerProps {
  user: any;
  marques: any[];
  categories?: any[];
  loadingCategories?: boolean;
  initialValues?: VetementFormValues;
  onSubmit?: (data: VetementFormValues) => Promise<void>;
  submitLabel?: string;
  submitIcon?: React.ReactNode;
  mode?: "create" | "update";
  activeTab?: string;
}

const VetementFormContainer: React.FC<VetementFormContainerProps> = ({
  user,
  marques,
  categories,
  loadingCategories = false,
  initialValues,
  onSubmit,
  submitLabel,
  submitIcon,
  mode = "create",
  activeTab: defaultActiveTab = "principal"
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  
  const {
    form,
    isSubmitting,
    imagePreview,
    setImagePreview,
    loading,
    handleSubmit
  } = useVetementForm(user, initialValues, onSubmit, mode);

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="principal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Informations principales
          </TabsTrigger>
          <TabsTrigger value="supplementaire" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Informations supplémentaires
          </TabsTrigger>
          <TabsTrigger value="vente" className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            Vente
          </TabsTrigger>
          <TabsTrigger value="etiquette" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Étiquette
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <ImageUploader
              form={form}
              user={user}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
          </div>
          
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <TabsContent value="principal">
                  <VetementFormFields
                    form={form}
                    marques={marques}
                    loading={loading}
                    onCategoriesChange={() => {}}
                    activeTab="principal"
                  />
                </TabsContent>
                
                <TabsContent value="supplementaire">
                  <VetementFormFields
                    form={form}
                    marques={marques}
                    loading={loading}
                    onCategoriesChange={() => {}}
                    activeTab="supplementaire"
                  />
                </TabsContent>
                
                <TabsContent value="vente">
                  <VetementFormFields
                    form={form}
                    marques={marques}
                    loading={loading}
                    onCategoriesChange={() => {}}
                    activeTab="vente"
                  />
                </TabsContent>
                
                <TabsContent value="etiquette">
                  <VetementFormFields
                    form={form}
                    marques={marques}
                    loading={loading}
                    onCategoriesChange={() => {}}
                    activeTab="etiquette"
                  />
                </TabsContent>
                
                <FormActions
                  isSubmitting={isSubmitting}
                  onCancel={() => navigate("/mes-vetements/liste")}
                  submitLabel={submitLabel || (mode === "create" ? "Ajouter le vêtement" : "Enregistrer les modifications")}
                  submitIcon={submitIcon || undefined}
                />
              </form>
            </Form>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default VetementFormContainer;
