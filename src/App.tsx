import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import { AddLink } from './pages/AddLink';
import { Login } from './pages/Login';
import SignUp from './pages/SignUp';
import { NotFound } from './pages/NotFound';
import LinkDetails from './pages/LinkDetails';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import PinnedLinks from './pages/PinnedLinks';
import AllLinks from './pages/AllLinks';
import SavedLinks from './pages/SavedLinks';
import ComingSoon from './pages/ComingSoon';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import CreateCategory from './pages/CreateCategory';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><SignUp /></Layout>} />
          <Route path="/features" element={<Layout><Features /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddLink />
              </ProtectedRoute>
            }
          />
          <Route
            path="/link/:id"
            element={
              <ProtectedRoute>
                <LinkDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pinned"
            element={
              <ProtectedRoute>
                <PinnedLinks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all"
            element={
              <ProtectedRoute>
                <AllLinks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedLinks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coming-soon"
            element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:categoryId"
            element={
              <ProtectedRoute>
                <CategoryDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:categoryId/edit"
            element={
              <ProtectedRoute>
                <CategoryDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-category"
            element={
              <ProtectedRoute>
                <CreateCategory />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <AppRoutes />
    </div>
  );
}

export default App;