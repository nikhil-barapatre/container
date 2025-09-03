import React, { Component } from 'react';
import { AuthService } from '../utils/auth';

interface HomeState {
  isAuthenticated: boolean;
  userEmail: string;
  hasError: boolean;
}

export default class Home extends Component<Record<string, never>, HomeState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      isAuthenticated: false,
      userEmail: '',
      hasError: false
    };
  }

  componentDidMount() {
    try {
      this.checkAuthentication();
    } catch (error) {
      console.error('Error during component mount:', error);
      // Fallback to unauthenticated state
      this.setState({ isAuthenticated: false, userEmail: '', hasError: true });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error caught:', error, errorInfo);
    this.setState({ hasError: true, isAuthenticated: false, userEmail: '' });
  }

  checkAuthentication = () => {
    try {
      const isAuth = AuthService.isAuthenticated();
      
      if (isAuth) {
        const token = AuthService.getToken();
        if (token) {
          const payload = AuthService.decodeToken(token) as { email?: string } | null;
          this.setState({
            isAuthenticated: true,
            userEmail: payload?.email || 'Unknown User'
          });
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      this.setState({ isAuthenticated: false, userEmail: '', hasError: true });
    }
  };

  handleNavigateToDashboard = () => {
    window.location.href = '/dashboard';
  };

  handleNavigateToRemote2 = () => {
    window.location.href = '/remote2';
  };

  handleLogout = () => {
    AuthService.clearToken();
    this.setState({ isAuthenticated: false, userEmail: '' });
  };

  render() {
    const { isAuthenticated, userEmail } = this.state;

    if (isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Container App</h1>
              <p className="text-gray-600 mb-6">Welcome back, {userEmail}!</p>
              
              <div className="space-y-4">
                <button
                  onClick={this.handleNavigateToDashboard}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                </button>
                
                <button
                  onClick={this.handleNavigateToRemote2}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Go to Remote2
                </button>
                
                <button
                  onClick={this.handleLogout}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Container App
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please login to access the microfrontend applications
            </p>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/container/login'}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// Disable static generation to prevent prerendering issues with microfrontends
export async function getServerSideProps() {
  return {
    props: {}, // Will be passed to the page component as props
  };
}
