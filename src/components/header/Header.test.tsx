import { render, screen } from '@testing-library/react';
import Header from './Header';
import { describe, expect, it } from 'vitest';

describe('Header', () => {
  it('should be displayed the Header component with the correct title', () => {
    render(<Header title="Rick and Morty" />);
    expect(screen.getByText('Rick and Morty')).toBeInTheDocument();
  });
});
