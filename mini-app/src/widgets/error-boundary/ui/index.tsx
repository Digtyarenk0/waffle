import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public componentDidCatch() {
    this.setState({
      hasError: true,
    });

    // setTimeout(() => {
    //   location.reload();
    // }, 30000);
  }

  onClickHandler = () => location.reload();

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <p className="text-white-main">Error</p>
          <button onClick={this.onClickHandler} className="p-5">
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
