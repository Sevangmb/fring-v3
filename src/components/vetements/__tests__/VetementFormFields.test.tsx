
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import VetementFormFields from '../VetementFormFields';
import { VetementFormValues, vetementFormSchema } from '../schema/VetementFormSchema';

// Create a wrapper component to provide the form context
const FormWrapper = ({ children, defaultValues = {} }) => {
  const form = useForm({
    resolver: zodResolver(vetementFormSchema),
    defaultValues,
  });

  return <Form {...form}>{children}</Form>;
};

describe('VetementFormFields', () => {
  it('renders principal tab correctly', () => {
    // Create a properly typed form with complete schema
    const form = useForm<VetementFormValues>({
      resolver: zodResolver(vetementFormSchema),
      defaultValues: {
        nom: '',
        categorie_id: 0,
        couleur: '',
        taille: '',
        description: '',
        marque: '',
        image_url: '',
        temperature: undefined,
        weather_type: undefined
      },
    });
    
    render(
      <VetementFormFields 
        form={form} 
        marques={[]} 
        loading={false} 
        activeTab="principal" 
      />
    );
    
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Catégorie/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Couleur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Taille/i)).toBeInTheDocument();
  });

  it('renders supplementaire tab correctly', () => {
    // Create a properly typed form with complete schema
    const form = useForm<VetementFormValues>({
      resolver: zodResolver(vetementFormSchema),
      defaultValues: {
        nom: '',
        categorie_id: 0,
        couleur: '',
        taille: '',
        description: '',
        marque: '',
        image_url: '',
        temperature: undefined,
        weather_type: undefined
      },
    });
    
    render(
      <VetementFormFields 
        form={form} 
        marques={[]} 
        loading={false} 
        activeTab="supplementaire" 
      />
    );
    
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type de météo/i)).toBeInTheDocument();
  });

  it('renders etiquette tab message', () => {
    // Create a properly typed form with complete schema
    const form = useForm<VetementFormValues>({
      resolver: zodResolver(vetementFormSchema),
      defaultValues: {
        nom: '',
        categorie_id: 0,
        couleur: '',
        taille: '',
        description: '',
        marque: '',
        image_url: '',
        temperature: undefined,
        weather_type: undefined
      },
    });
    
    render(
      <VetementFormFields 
        form={form} 
        marques={[]} 
        loading={false} 
        activeTab="etiquette" 
      />
    );
    
    expect(screen.getByText(/Informations d'étiquette/i)).toBeInTheDocument();
    expect(screen.getByText(/Cette fonctionnalité sera bientôt disponible/i)).toBeInTheDocument();
  });
});
