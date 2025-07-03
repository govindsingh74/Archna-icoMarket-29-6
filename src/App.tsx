import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import ICOListingPage from './pages/ICOListingPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import UserRequestsPage from './pages/UserRequestsPage';
import NFTSubmissionPage from './pages/NFTSubmissionPage';
import NFTIndexPage from './pages/NFTIndexPage';
import NFTDetailPage from './pages/NFTDetailPage';
import DexIndexPage from './pages/DexIndexPage';
import TokenAnalyticsPage from './pages/TokenAnalyticsPage';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ico" element={<ICOListingPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/partner" element={<UserRequestsPage />} />
          <Route path="/influencer" element={<UserRequestsPage />} />
          <Route path="/update-project" element={<UserRequestsPage />} />
          <Route path="/show-ads" element={<UserRequestsPage />} />
          <Route path="/submit-nft" element={<NFTSubmissionPage />} />
          <Route path="/nft-index" element={<NFTIndexPage />} />
          <Route path="/nft/:id" element={<NFTDetailPage />} />
          <Route path="/dex-index" element={<DexIndexPage />} />
          <Route path="/token-analytics/:id" element={<TokenAnalyticsPage />} />
          <Analytics />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;