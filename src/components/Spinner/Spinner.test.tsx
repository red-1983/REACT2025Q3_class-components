import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';
import { describe, expect, it } from 'vitest';

describe('Spinner', () => {
  it('should render the card component with the correct props', () => {
    render(<Spinner />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });
});
