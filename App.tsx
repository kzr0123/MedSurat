import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { PatientForm } from './pages/PatientForm';
import { PatientSuccess } from './pages/PatientSuccess';
import { LoginPage } from './pages/LoginPage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { ProcessRequest } from './pages/ProcessRequest';
import { VerificationPage } from './pages/VerificationPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/patient/form" element={<PatientForm />} />
            <Route path="/patient/success" element={<PatientSuccess />} />
            
            {/* Verification Route */}
            <Route path="/verify" element={<VerificationPage />} />
            
            {/* Auth Route */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Officer Routes */}
            <Route path="/officer/dashboard" element={
              <ProtectedRoute>
                <OfficerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Nested route for processing specific requests */}
            <Route path="/officer/dashboard/process/:id" element={
              <ProtectedRoute>
                <ProcessRequest />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;