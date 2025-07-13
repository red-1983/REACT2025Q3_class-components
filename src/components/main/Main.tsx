import { Component, ReactNode } from 'react';

interface MainProps {
  children?: ReactNode;
}

class Main extends Component<MainProps> {
  render() {
    return (
      <main>
        {this.props.children}
      </main>
    );
  }
}

export default Main;
