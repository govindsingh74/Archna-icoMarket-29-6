import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutUsSection from '../components/about/AboutUsSection';
import GoalSection from '../components/about/GoalSection';
import CostEffectiveSection from '../components/about/CostEffectiveSection';
import CMCCoinGeckoSection from '../components/about/CMCCoinGeckoSection';
import MarketingSection from '../components/about/MarketingSection';
import TeamSection from '../components/about/TeamSection';
import TestimonialsSection from '../components/about/TestimonialsSection';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                About TokenLaunch
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                We're the premier platform for launching and discovering cryptocurrency projects. 
                Our mission is to bridge the gap between innovative blockchain projects and forward-thinking investors.
              </p>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <AboutUsSection />

        {/* Goals Section */}
        <GoalSection />


        {/* CMC & CoinGecko Section */}
        <CMCCoinGeckoSection />


        {/* Team Section */}
        <TeamSection />

        {/* Testimonials Section */}
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;