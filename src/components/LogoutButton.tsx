'use client';

import React, { Component } from 'react';
import { AuthService } from '../utils/auth';

export default class LogoutButton extends Component {
  handleLogout = () => {
    // Clear token using AuthService
    AuthService.clearToken();
    window.location.href = '/container/login';
  };

  render() {
    return (
      <button
        onClick={this.handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    );
  }
}
