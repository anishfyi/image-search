import { render, screen, fireEvent } from '@testing-library/react';
import ImageViewer from '../ImageViewer';
import { ImageResult } from '../../../types/image';

const mockImage: ImageResult = {
  id: '1',
  title: 'Test Image',
  url: 'https://example.com/image.jpg',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  source: 'Test Source',
  size: '1MB',
  width: 800,
  height: 600,
  type: 'image/jpeg',
  metadata: {
    similarity: 0.95,
    uploadedImage: {
      width: 800,
      height: 600,
      type: 'image/jpeg',
      size: '2MB',
    },
  },
};

describe('ImageViewer', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders image viewer when image is provided', () => {
    render(<ImageViewer image={mockImage} onClose={mockOnClose} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByAltText(mockImage.title)).toBeInTheDocument();
    expect(screen.getByText(mockImage.title)).toBeInTheDocument();
    expect(screen.getByText('95% similar')).toBeInTheDocument();
    expect(screen.getByText(`Source: ${mockImage.source}`)).toBeInTheDocument();
    expect(screen.getByText(`Size: ${mockImage.size}`)).toBeInTheDocument();
  });

  it('does not render when image is null', () => {
    render(<ImageViewer image={null} onClose={mockOnClose} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    render(<ImageViewer image={mockImage} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close image viewer');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays image metadata correctly', () => {
    render(<ImageViewer image={mockImage} onClose={mockOnClose} />);
    
    expect(screen.getByText(`Original image: ${mockImage.metadata?.uploadedImage?.width}x${mockImage.metadata?.uploadedImage?.height} pixels`)).toBeInTheDocument();
    expect(screen.getByText(`Size: ${mockImage.metadata?.uploadedImage?.size}`)).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<ImageViewer image={mockImage} onClose={mockOnClose} />);
    
    const image = screen.getByAltText(mockImage.title);
    expect(image).toHaveFocus();
    
    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
}); 