import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccessibleModal from '../AccessibleModal';

describe('AccessibleModal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<AccessibleModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape key', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus within the modal', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    const closeButton = screen.getByLabelText('Close modal');
    
    // Focus should be on the modal initially
    expect(modal).toHaveFocus();
    
    // Tab should cycle through focusable elements
    fireEvent.keyDown(modal, { key: 'Tab' });
    expect(closeButton).toHaveFocus();
    
    // Shift+Tab should cycle backwards
    fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true });
    expect(modal).toHaveFocus();
  });

  it('restores focus to the last focused element when closed', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    
    render(<AccessibleModal {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Close modal'));
    
    expect(button).toHaveFocus();
    document.body.removeChild(button);
  });
}); 