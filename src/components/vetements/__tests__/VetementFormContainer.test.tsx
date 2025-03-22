
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import VetementFormContainer from '../VetementFormContainer';

// Mock the required hooks and components
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('@/hooks/useVetementForm', () => ({
  useVetementForm: () => ({
    form: {
      handleSubmit: vi.fn(),
      control: {},
      getValues: () => ({}),
      setValue: vi.fn(),
      watch: vi.fn(),
    },
    isSubmitting: false,
    imagePreview: null,
    setImagePreview: vi.fn(),
    loading: false,
    handleSubmit: vi.fn(),
  }),
}));

vi.mock('../VetementFormFields', () => ({
  default: () => <div data-testid="form-fields">Form Fields Component</div>,
}));

vi.mock('../image-upload/ImageUploader', () => ({
  default: () => <div data-testid="image-uploader">Image Uploader Component</div>,
}));

vi.mock('./FormActions', () => ({
  default: () => <div data-testid="form-actions">Form Actions Component</div>,
}));

describe('VetementFormContainer', () => {
  it('renders all required components', () => {
    render(
      <VetementFormContainer
        user={{ id: '123' }}
        marques={[]}
      />
    );

    expect(screen.getByTestId('image-uploader')).toBeInTheDocument();
    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByTestId('form-actions')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    render(
      <VetementFormContainer
        user={{ id: '123' }}
        marques={[]}
        mode="update"
        submitLabel="Update"
        activeTab="supplementaire"
      />
    );

    // Since we're mocking the components, we can just verify they're rendered
    expect(screen.getByTestId('image-uploader')).toBeInTheDocument();
    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByTestId('form-actions')).toBeInTheDocument();
  });
});
