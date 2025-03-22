
import React from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";
import { useVetementForm } from "@/hooks/useVetementForm";
import VetementFormFields from "./VetementFormFields";
import { VetementFormValues } from "./schema/VetementFormSchema";
import ImageUploader from "./image-upload/ImageUploader";
import FormActions from "./FormActions";

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
  activeTab = "principal"
}) => {
  const navigate = useNavigate();
  
  const {
    form,
    isSubmitting,
    imagePreview,
    setImagePreview,
    loading,
    handleSubmit
  } = useVetementForm(user, initialValues, onSubmit, mode);

  return (
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
            <VetementFormFields
              form={form}
              marques={marques}
              loading={loading}
              onCategoriesChange={() => {}}
              activeTab={activeTab}
              user={user}
            />
            
            <FormActions
              isSubmitting={isSubmitting}
              onCancel={() => navigate("/mes-vetements/liste")}
              submitLabel={submitLabel || (mode === "create" ? "Ajouter le vêtement" : "Enregistrer les modifications")}
              submitIcon={submitIcon || (mode === "update" ? <Save className="mr-2 h-4 w-4" /> : undefined)}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VetementFormContainer;
