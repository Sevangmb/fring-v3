
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormActions from '../FormActions';

describe('FormActions', () => {
  it('renders submit and cancel buttons', () => {
    const onCancel = vi.fn();
    render(<FormActions isSubmitting={false} onCancel={onCancel} />);
    
    expect(screen.getByText('Ajouter le vêtement')).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    const onCancel = vi.fn();
    render(<FormActions isSubmitting={true} onCancel={onCancel} />);
    
    expect(screen.getByText('Traitement en cours...')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<FormActions isSubmitting={false} onCancel={onCancel} />);
    
    fireEvent.click(screen.getByText('Annuler'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders custom labels when provided', () => {
    const onCancel = vi.fn();
    render(
      <FormActions 
        isSubmitting={false} 
        onCancel={onCancel} 
        submitLabel="Enregistrer" 
        cancelLabel="Retour"
      />
    );
    
    expect(screen.getByText('Enregistrer')).toBeInTheDocument();
    expect(screen.getByText('Retour')).toBeInTheDocument();
  });
});
