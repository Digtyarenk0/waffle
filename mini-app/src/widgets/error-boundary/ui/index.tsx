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
        <div className="w-[100wh] h-[100vh]  bg-black-theme">
          <p className="text-white-main">Ooops!</p>
          <p className="text-white-main">Error, pls reload page</p>
          <button onClick={this.onClickHandler} className="p-5 m-5 bg-slate-600">
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
