import React from 'react';
import { Megaphone, Target, Users, TrendingUp, Zap, Globe, MessageCircle, Star } from 'lucide-react';

const MarketingSection: React.FC = () => {
  const marketingServices = [
    {
      icon: Megaphone,
      title: "Social Media Marketing",
      description: "Comprehensive social media campaigns across Twitter, Telegram, Discord, and more.",
      features: ["Content creation", "Community management", "Influencer partnerships", "Viral campaigns"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-500/10"
    },
    {
      icon: Target,
      title: "Targeted Advertising",
      description: "Precision-targeted ads to reach your ideal investor demographic across multiple platforms.",
      features: ["Google Ads", "Facebook/Meta Ads", "Crypto-specific platforms", "Retargeting campaigns"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-500/10"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Build and nurture a strong, engaged community around your project.",
      features: ["Discord setup", "Telegram groups", "Community events", "Ambassador programs"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-500/10"
    },
    {
      icon: TrendingUp,
      title: "PR & Media Outreach",
      description: "Get featured in top crypto publications and news outlets.",
      features: ["Press releases", "Media interviews", "Podcast appearances", "Industry events"],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-500/10"
    },
    {
      icon: Zap,
      title: "Influencer Marketing",
      description: "Partner with top crypto influencers and thought leaders.",
      features: ["Influencer partnerships", "YouTube collaborations", "Twitter campaigns", "AMA sessions"],
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-500/10"
    },
    {
      icon: Globe,
      title: "Content Marketing",
      description: "High-quality content that educates and engages your audience.",
      features: ["Blog posts", "Whitepapers", "Video content", "Infographics"],
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10"
    }
  ];

  const successMetrics = [
    { metric: "500%", label: "Average Engagement Increase" },
    { metric: "10M+", label: "Total Reach Generated" },
    { metric: "250+", label: "Successful Campaigns" },
    { metric: "95%", label: "Client Satisfaction Rate" }
  ];

  const packages = [
    {
      name: "Starter",
      price: "$2,999",
      duration: "1 Month",
      description: "Perfect for new projects looking to build initial awareness",
      features: [
        "Social media setup & optimization",
        "Basic content creation (10 posts)",
        "Community management",
        "1 press release",
        "Basic analytics reporting"
      ],
      popular: false
    },
    {
      name: "Growth",
      price: "$7,999",
      duration: "3 Months",
      description: "Comprehensive marketing for serious growth",
      features: [
        "Everything in Starter",
        "Influencer partnerships (5-10 influencers)",
        "Targeted advertising campaigns",
        "Weekly content creation (40+ posts)",
        "PR outreach to 50+ publications",
        "Community events & AMAs",
        "Advanced analytics & reporting"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$19,999",
      duration: "6 Months",
      description: "Full-scale marketing for maximum impact",
      features: [
        "Everything in Growth",
        "Dedicated marketing manager",
        "Major influencer partnerships (20+ influencers)",
        "Multi-platform advertising",
        "Daily content creation",
        "Conference speaking opportunities",
        "Custom marketing strategies",
        "24/7 support & monitoring"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Boost Marketing for Your New Token
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Supercharge your token launch with our comprehensive marketing services. 
            From social media campaigns to influencer partnerships, we'll help you reach the right audience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {marketingServices.map((service, index) => (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 group hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${service.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                {service.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Our Marketing Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {successMetrics.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-2">{item.metric}</div>
                <div className="text-blue-100">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Packages */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-8">
            Marketing Packages
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-slate-700 rounded-2xl p-6 border-2 ${
                  pkg.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-slate-200 dark:border-slate-600 shadow-lg'
                } transition-all duration-300 hover:shadow-xl`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {pkg.name}
                  </h4>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                    {pkg.price}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                    {pkg.duration}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {pkg.description}
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1'
                    : 'bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-500'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Ready to Launch Your Marketing Campaign?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Our marketing experts are ready to help you create a buzz around your token launch. 
            Let's discuss your project and create a custom marketing strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Schedule Consultation
            </button>
            <button className="px-8 py-3 bg-white dark:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg border border-slate-300 dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors">
              View Case Studies
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;