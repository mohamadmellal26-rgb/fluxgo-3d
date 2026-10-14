import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import BentoGridSection from './component/BentoGridSection';
import BentoGridSection2 from './component/BentoGridSection2';
import CommunityHubSection from './component/CommunityHubSection';
import FeatureShowcase from './component/FeatureShowcase';
import FinalCallToActionFooter from './component/FinalCallToActionFooter';
import Header from './component/1.header';
import HeroSection from './component/heroSection';
import InteractiveExportSection from './component/InteractiveExportSection';
import LogoCloud from './component/LogoCloud';
import PortfolioShowcase from './component/PortfolioShowcase';
import ProductDemoSection from './component/ProductDemoSection';
import ShowcaseGrid from './component/ShowcaseGrid';
import TestimonialSection from './component/TestimonialSection';
import TestimonialSection2 from './component/TestimonialSection2';
import TestimonialsGridSection3 from './component/TestimonialsGridSection3';

import Dashboard from './component/Dashboard/Dashboard';
import Editor3d from './component/Dashboard/editer3d/editer3d';
import Editor2d from './component/Dashboard/editer2d/editer2d';
import Auth from './component/auth/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('user_token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

function AuthPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  if (localStorage.getItem('user_token')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Auth onAuthSuccess={handleSuccess} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <HeroSection />
            <ShowcaseGrid />
            <LogoCloud />
            <PortfolioShowcase />
            <TestimonialSection />
            <FeatureShowcase />
            <BentoGridSection />
            <TestimonialSection2 />
            <BentoGridSection2 />
            <ProductDemoSection />
            <InteractiveExportSection />
            <TestimonialsGridSection3 />
            <CommunityHubSection />
            <FinalCallToActionFooter />
          </>
        } />

        <Route path="/auth" element={<AuthPage />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* استخدام رمز طويل ومعقد كمسار (مثل الـ ID أو Hash فريد لكل مشروع) */}
        <Route 
          path="/editor3d/:projectToken" 
          element={
            <ProtectedRoute>
              <Editor3d />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/editor2d/:projectToken" 
          element={
            <ProtectedRoute>
              <Editor2d />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;