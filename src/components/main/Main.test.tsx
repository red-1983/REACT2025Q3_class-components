import { render, screen } from '@testing-library/react';
import Main from './Main';
import { describe, expect, it } from 'vitest';
import { Component } from 'react';

describe('Main component', () => {
  it('should render its children correctly', () => {
    class TestChild extends Component {
      render() {
        return <div>This is a child component</div>;
      }
    }

    render(
      <Main>
        <TestChild />
      </Main>
    );
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();

    expect(screen.getByText('This is a child component')).toBeInTheDocument();
  });
  it('should render an empty main tag when no children are provided', () => {
    render(<Main />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toBeEmptyDOMElement();
  });
});
