import { Component } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

interface ProblemChildProps {
  shouldThrow?: boolean;
}

describe('ErrorBoundary', () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  class ProblemChild extends Component<ProblemChildProps> {
    render() {
      if (this.props.shouldThrow) {
        throw new Error('Test Error');
      }
      return <div>child component without error</div>;
    }
  }
  it('should intercept and handle errors in child components and display fallback UI', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(
      screen.getByText('child component without error')
    ).toBeInTheDocument();
    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/что-то пошло не так/i)).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should throw an error when a button is clicked and trigger the fallback UI', () => {
    interface ErrorButtonState {
      throwError: boolean;
    }
    class ErrorButton extends Component<
      Record<string, never>,
      ErrorButtonState
    > {
      state: ErrorButtonState = { throwError: false };
      handleClick = () => {
        this.setState({ throwError: true });
      };
      render() {
        if (this.state.throwError) {
          throw new Error('Button click error');
        }
        return <button onClick={this.handleClick}>Throw Error</button>;
      }
    }

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(button);
    expect(screen.getByText(/что-то пошло не так/i)).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
