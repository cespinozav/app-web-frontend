import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // Puedes enviar el error a un servicio externo aquí
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, color: 'red', background: '#fff', zIndex: 9999 }}>
          <h2>¡Ocurrió un error en la aplicación!</h2>
          <pre>{String(this.state.error)}</pre>
          <pre>{this.state.errorInfo ? this.state.errorInfo.componentStack : ''}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
