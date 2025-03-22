
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVetementForm } from '../useVetementForm';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/services/vetement', () => ({
  addVetement: vi.fn().mockResolvedValue({ id: 1 }),
}));

describe('useVetementForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useVetementForm({ id: '123' }));
    
    expect(result.current.form).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.imagePreview).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('sets image preview correctly', () => {
    const { result } = renderHook(() => useVetementForm({ id: '123' }));
    
    act(() => {
      result.current.setImagePreview('https://example.com/image.jpg');
    });
    
    expect(result.current.imagePreview).toBe('https://example.com/image.jpg');
  });

  it('initializes with provided values', () => {
    const initialValues = {
      nom: 'Test',
      categorie_id: 1,
      couleur: 'Red',
      taille: 'M',
      description: 'Description',
      marque: 'Brand',
      temperature: 'chaud' as const,
      image_url: 'https://example.com/image.jpg',
    };
    
    const { result } = renderHook(() => 
      useVetementForm({ id: '123' }, initialValues)
    );
    
    expect(result.current.form.getValues()).toEqual(initialValues);
    expect(result.current.imagePreview).toBe(initialValues.image_url);
  });
});
