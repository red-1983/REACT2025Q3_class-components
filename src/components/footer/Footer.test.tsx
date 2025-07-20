import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { describe, expect, it } from 'vitest';

describe('Footer', () => {
  it('should be displayed the Footer component ', () => {
    render(<Footer />);
    expect(screen.getByText(/2025 Rolling Scopes School/i)).toBeInTheDocument();
  });
});
