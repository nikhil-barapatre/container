import React, { Component } from 'react';
import { AuthService } from '../../utils/auth';

interface LoginState {
  email: string;
  password: string;
  error: string;
}

export default class LoginPage extends Component<Record<string, never>, LoginState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: ''
    };
  }

  handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { email, password } = this.state;

    if (email === 'test@example.com' && password === 'password') {
      try {
        // Generate and set token
        const token = AuthService.generateToken(email);
        AuthService.setToken(token);

        alert('Successfully logged in!');

        // Redirect to dashboard route which will load the dashboard microfrontend
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Login error:', error);
        this.setState({ error: 'An error occurred during login' });
      }
    } else {
      this.setState({ error: 'Invalid email or password' });
    }
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-lg w-96">
          <h1 className="text-2xl mb-6 font-bold text-center">Login</h1>
          <form onSubmit={this.handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {error && (
              <div className="mb-4 text-red-500 text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}
