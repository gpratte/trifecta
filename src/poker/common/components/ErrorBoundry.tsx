import React, {ErrorInfo, ReactNode} from 'react'

interface Props {
  customUI?: any
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}
class ErrorBoundary extends React.Component<Props, State> {

  public state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(`componentDidCatch ${error} ${errorInfo}`)
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.customUI) {
        return this.props.customUI;
      }
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;