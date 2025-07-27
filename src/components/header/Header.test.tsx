import { render, screen } from '@testing-library/react';
import Header from './Header';
import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

describe('Header', () => {
  it('should be displayed the Header component with the correct title', () => {
    render(
      <BrowserRouter>
        <Header title="Rick and Morty" />
      </BrowserRouter>
    );
    expect(screen.getByText('Rick and Morty')).toBeInTheDocument();
  });
});
