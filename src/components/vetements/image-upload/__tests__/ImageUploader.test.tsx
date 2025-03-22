
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ImageUploader from '../ImageUploader';
import { vetementFormSchema } from '../../schema/VetementFormSchema';

// Mock the hooks
vi.mock('@/hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    fileInputRef: { current: null },
    handleImageChange: vi.fn(),
  }),
}));

vi.mock('@/hooks/useDetection', () => ({
  useDetection: () => ({
    loading: false,
    error: null,
    steps: [],
    currentStep: null,
    detectImage: vi.fn(),
  }),
}));

describe('ImageUploader', () => {
  it('renders upload area when no image is provided', () => {
    const form = useForm({
      resolver: zodResolver(vetementFormSchema),
      defaultValues: {},
    });

    render(
      <ImageUploader
        form={form}
        user={{ id: '123' }}
        imagePreview={null}
        setImagePreview={vi.fn()}
      />
    );

    expect(screen.getByText('Cliquez pour ajouter une image')).toBeInTheDocument();
  });

  it('renders image preview when image is provided', () => {
    const form = useForm({
      resolver: zodResolver(vetementFormSchema),
      defaultValues: {},
    });

    render(
      <ImageUploader
        form={form}
        user={{ id: '123' }}
        imagePreview="https://example.com/image.jpg"
        setImagePreview={vi.fn()}
      />
    );

    expect(screen.getByAltText('Aperçu du vêtement')).toBeInTheDocument();
  });
});
