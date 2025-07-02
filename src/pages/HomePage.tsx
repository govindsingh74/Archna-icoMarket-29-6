import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/hero/HeroSection';
import CompanySection from '../components/hero/CompanySection';
import StatsSection from '../components/StatsSection';
import TopProjectsSection from '../components/TopProjectsSection';
import UpcomingProjectsSection from '../components/UpcomingProjectsSection';
import ReportSection from '../components/ReportSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <CompanySection />
        <StatsSection />
        <TopProjectsSection />
        <UpcomingProjectsSection />
        <ReportSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;