"use client";
import React, { Component } from "react";
import dynamic from "next/dynamic";
import { AuthService } from "../utils/auth";

const Remote2Page = dynamic(() => import("remote2/RemotePage"), {
  ssr: false,
  loading: () => <div>Loading Remote2...</div>,
});

interface Remote2RouteState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export default class Remote2Route extends Component<{}, Remote2RouteState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this.checkAuthentication();
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

  render() {
    const { isAuthenticated, isLoading } = this.state;

    if (isLoading) {
      return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
      return <div>Redirecting to login...</div>;
    }

    return <Remote2Page />;
  }
}
