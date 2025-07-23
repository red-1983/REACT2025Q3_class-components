import { render, screen } from '@testing-library/react';
import Card, { CardProps } from './Card';
import { describe, expect, it } from 'vitest';

const mockCardProps: CardProps = {
  name: 'name',
  url: 'url',
  description: 'description',
};

describe('Card', () => {
  it('should render the card component with the correct props', () => {
    render(<Card {...mockCardProps} />);
    expect(screen.getByText(mockCardProps.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockCardProps.name)).toBeInTheDocument();
    if (mockCardProps.description) {
      expect(screen.getByText(mockCardProps.description)).toBeInTheDocument();
    }
  });
  it('handles missing description prop gracefully', () => {
    const { name, url } = mockCardProps;
    render(<Card name={name} url={url} />);
    expect(screen.queryByText('description')).not.toBeInTheDocument();
  });
});
