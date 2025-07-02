import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CostEffectiveSection from '../components/about/CostEffectiveSection';
import MarketingSection from '../components/about/MarketingSection';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                Pricing & Plans
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Choose the perfect plan for your project. From free listings to comprehensive marketing packages, 
                we have solutions that fit every budget and requirement.
              </p>
            </div>
          </div>
        </section>

        {/* Cost Effective Section */}
        <CostEffectiveSection />

        {/* Marketing Section */}
        <MarketingSection />
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;