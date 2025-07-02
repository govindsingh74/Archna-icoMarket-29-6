import React from 'react';
import { TrendingUp, BarChart3, Globe, Zap, CheckCircle, ExternalLink } from 'lucide-react';

const CMCCoinGeckoSection: React.FC = () => {
  const platforms = [
    {
      name: "CoinMarketCap",
      logo: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=200",
      description: "Get listed on the world's most-referenced price-tracking website for cryptocurrencies.",
      features: [
        "Global visibility to millions of users",
        "Real-time price tracking",
        "Market cap rankings",
        "Trading volume analytics",
        "Community engagement tools"
      ],
      stats: {
        users: "100M+",
        ranking: "#1",
        coverage: "Global"
      },
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "CoinGecko",
      logo: "https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg?auto=compress&cs=tinysrgb&w=200",
      description: "Comprehensive cryptocurrency data platform with advanced analytics and market insights.",
      features: [
        "Detailed project analytics",
        "Developer activity tracking",
        "Community metrics",
        "DeFi ecosystem integration",
        "NFT marketplace data"
      ],
      stats: {
        users: "50M+",
        ranking: "#2",
        coverage: "Worldwide"
      },
      color: "from-green-500 to-green-600"
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Increased Visibility",
      description: "Reach millions of potential investors and traders worldwide through major listing platforms.",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: BarChart3,
      title: "Market Analytics",
      description: "Access comprehensive market data and analytics to track your token's performance.",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Expand your project's reach to international markets and diverse investor communities.",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Zap,
      title: "Instant Updates",
      description: "Real-time price feeds and market data updates keep your community informed.",
      color: "text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            CoinMarketCap & CoinGecko Listings
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We help you get listed on the world's leading cryptocurrency data platforms, 
            ensuring maximum visibility and credibility for your project.
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-white/10"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 p-2">
                  <img
                    src={platform.logo}
                    alt={`${platform.name} logo`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {platform.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Leading crypto data platform
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {platform.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {platform.stats.users}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Users</div>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {platform.stats.ranking}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Ranking</div>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {platform.stats.coverage}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Coverage</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {platform.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className={`w-full py-3 px-6 bg-gradient-to-r ${platform.color} text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2`}>
                <span>Get Listed on {platform.name}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-8">
            Why List on Major Platforms?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center group hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-8">
            Our Listing Process
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Submit Application</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Provide project details and documentation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Review Process</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Our team reviews and prepares your listing
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Platform Submission</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                We submit to CMC and CoinGecko on your behalf
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Go Live</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Your token goes live on major platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CMCCoinGeckoSection;