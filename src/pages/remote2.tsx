"use client";
import React, { Component } from "react";
import { AuthService } from "../utils/auth";

// Fallback component
const Remote2Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Remote2</h2>
      <p className="text-gray-600">Remote2 microfrontend is not available.</p>
      <p className="text-sm text-gray-500 mt-2">
        Make sure the remote2 service is running on port 3002.
      </p>
    </div>
  </div>
);

interface Remote2RouteState {
  isAuthenticated: boolean;
  isLoading: boolean;
  RemoteComponent: React.ComponentType | null;
  loadError: boolean;
}

export default class Remote2Route extends Component<Record<string, never>, Remote2RouteState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isLoading: true,
      RemoteComponent: null,
      loadError: false
    };
  }

  componentDidMount() {
    this.checkAuthentication();
    this.loadRemoteComponent();
  }

  checkAuthentication = () => {
    const isAuth = AuthService.isAuthenticated();
    
    if (!isAuth) {
      window.location.href = '/container/login';
      return;
    }

    this.setState({
      isAuthenticated: true,
      isLoading: false
    });
  };

  loadRemoteComponent = async () => {
    try {
      // Dynamic import for module federation
      const remoteModule = await import('remote2/RemotePage' as string);
      this.setState({ RemoteComponent: remoteModule.default });
    } catch (error) {
      console.warn('Failed to load remote2 remote:', error);
      this.setState({ loadError: true });
    }
  };

  render() {
    const { isAuthenticated, isLoading, RemoteComponent, loadError } = this.state;

    if (isLoading) {
      return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
      return <div>Redirecting to login...</div>;
    }

    if (loadError || !RemoteComponent) {
      return <Remote2Fallback />;
    }

    return <RemoteComponent />;
  }
}

// Disable static generation to prevent prerendering issues with microfrontends
export async function getServerSideProps() {
  return {
    props: {}, // Will be passed to the page component as props
  };
}
