import React, { useState } from 'react';
import { X, Mail, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
  onAuthSuccess: (user: any) => void;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  password: string;
  confirmPassword: string;
}

interface SigninFormData {
  email: string;
  password: string;
}

interface ForgotPasswordFormData {
  email: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin',
  onAuthSuccess 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [signupData, setSignupData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const [signinData, setSigninData] = useState<SigninFormData>({
    email: '',
    password: ''
  });

  const [forgotData, setForgotData] = useState<ForgotPasswordFormData>({
    email: ''
  });

  const validateSignup = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!signupData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!signupData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!signupData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) newErrors.email = 'Email is invalid';
    if (!signupData.password) newErrors.password = 'Password is required';
    else if (signupData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (signupData.password !== signupData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignin = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!signinData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signinData.email)) newErrors.email = 'Email is invalid';
    if (!signinData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignup()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            location: signupData.location
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Insert user data into our custom users table (without password_hash)
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: signupData.email,
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            location: signupData.location || null
          });

        if (insertError) {
          console.error('Error inserting user data:', insertError);
          // Don't throw here - the auth user was created successfully
          // The profile can be created later if needed
        }

        onAuthSuccess(data.user);
        onClose();
        alert('Account created successfully! Please check your email to verify your account.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrors({ general: error.message || 'An error occurred during signup' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignin()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signinData.email,
        password: signinData.password
      });

      if (error) throw error;

      if (data.user) {
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      setErrors({ general: error.message || 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotData.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      alert('Password reset email sent! Please check your inbox.');
      setMode('signin');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setErrors({ general: error.message || 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSignupData({
      firstName: '',
      lastName: '',
      email: '',
      location: '',
      password: '',
      confirmPassword: ''
    });
    setSigninData({
      email: '',
      password: ''
    });
    setForgotData({
      email: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Your Account';
      case 'signin': return 'Welcome Back';
      case 'forgot': return 'Reset Password';
      default: return 'Welcome';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return 'Join thousands of crypto enthusiasts';
      case 'signin': return 'Sign in to your account';
      case 'forgot': return 'Enter your email to reset password';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
          <div className="flex min-h-[600px]">
            {/* Left Side - Image and Motivational Text */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 flex-col justify-center items-center text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="mb-8">
                  <img
                    src="https://wxyzgmayoanzetyuzwvi.supabase.co/storage/v1/object/sign/hero/SighIn.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOWNiMTcwYy04MTc5LTQ0NjgtOTFmNS1iMDVhMTZiM2M3YzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoZXJvL1NpZ2hJbi5wbmciLCJpYXQiOjE3NTE0NDUwODUsImV4cCI6MTc4Mjk4MTA4NX0.U1yxWRrFqzIfXKUsMqTnVoUNydSNZz6VKXCQ8ZSAEOc"
                    alt="Crypto Innovation"
                    className="w-84 h-84 object-cover shadow-2xl rounded-xl"
                  />
                </div>
                
                <h2 className="text-3xl font-bold mb-4">
                  {mode === 'signup' && "Start Your Crypto Journey"}
                  {mode === 'signin' && "Welcome Back, Innovator"}
                  {mode === 'forgot' && "Secure Your Future"}
                </h2>
                
                <p className="text-lg opacity-90 leading-relaxed">
                  {mode === 'signup' && "Join the revolution of decentralized finance. Create, invest, and grow with the most innovative crypto platform."}
                  {mode === 'signin' && "Continue building the future of blockchain technology. Your next big opportunity awaits."}
                  {mode === 'forgot' && "Don't worry, we'll help you regain access to your account and continue your crypto journey."}
                </p>
                
                <div className="mt-8 flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{getTitle()}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{getSubtitle()}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Signup Form */}
              {mode === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          value={signupData.firstName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                            errors.firstName ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="Enter first name"
                        />
                      </div>
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          value={signupData.lastName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                            errors.lastName ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="Enter last name"
                        />
                      </div>
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        value={signupData.location}
                        onChange={(e) => setSignupData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          errors.password ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </div>

                  <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-slate-600 dark:text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Sign In
                      </button>
                    </p>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              )}

              {/* Signin Form */}
              {mode === 'signin' && (
                <form onSubmit={handleSignin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        value={signinData.email}
                        onChange={(e) => setSigninData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signinData.password}
                        onChange={(e) => setSigninData(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          errors.password ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>

                  <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-600">
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-blue-600 hover:text-blue-700 text-sm mb-2"
                    >
                      Forgot Password?
                    </button>
                    <p className="text-slate-600 dark:text-slate-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Forgot Password Form */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        value={forgotData.email}
                        onChange={(e) => setForgotData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                  </div>

                  <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-slate-600 dark:text-slate-400">
                      Remember your password?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Sign In
                      </button>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;