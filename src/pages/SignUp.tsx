import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      await signUp(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }
      
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGoogleSignUp = () => {
    toast('Google sign-up is coming soon!', { icon: '🚧' });
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-black/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              Join MindLink Today
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Create your account and start organizing your digital content with AI-powered features.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Sign Up Form Section */}
      <div className="w-full bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <Button
              type="button"
              onClick={handleGoogleSignUp}
              isLoading={isLoading}
              fullWidth
              variant="outline"
              className="mb-4"
            >
              Sign up with Google
            </Button>
            <div className="text-center my-2">
              <span className="text-gray-500">or</span>
            </div>
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="flex flex-wrap items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the
                </label>
                <Link
                  to="/terms"
                  className="ml-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Terms of Service
                </Link>
                <span className="mx-1 text-sm text-gray-700">and</span>
                <Link
                  to="/privacy"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Privacy Policy
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                {!isLoading && <ArrowRightIcon className="w-5 h-5" />}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Signup; 