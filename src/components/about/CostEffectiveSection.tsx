import React from 'react';
import { DollarSign, TrendingDown, Zap, CheckCircle, Star, Award } from 'lucide-react';

const CostEffectiveSection: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Low Listing Fees",
      description: "Starting from free listings to premium packages, we offer the most competitive rates in the industry.",
      price: "From $100",
      features: ["Basic listing included", "No hidden fees", "Transparent pricing"]
    },
    {
      icon: TrendingDown,
      title: "Reduced Marketing Costs",
      description: "Our platform provides built-in marketing exposure, reducing your need for expensive external campaigns.",
      price: "Save 70%",
      features: ["Built-in audience", "Social media integration", "SEO optimization"]
    },
    {
      icon: Zap,
      title: "Fast Implementation",
      description: "Quick setup process means lower development costs and faster time to market for your project.",
      price: "24-48 Hours",
      features: ["Rapid deployment", "Technical support", "Easy integration"]
    }
  ];

  const pricingTiers = [
    {
      name: "Base",
      offer: "(Get 75% off For August-25)",
      price: "$100",
      description: "Perfect for startups and early-stage projects",
      features: [
        "Basic project listing",
        "Community access",
        "Standard support",
        "Basic analytics",
        "Social media links"
      ],
      popular: false,
      color: "border-slate-200 dark:border-slate-600"
    },
    {
      name: "Silver",
      price: "$299",
      description: "Enhanced visibility and premium features",
      features: [
        "Everything in Free",
        "Featured placement",
        "Priority support",
        "Advanced analytics",
        "Marketing assistance",
        "Custom branding"
      ],
      popular: true,
      color: "border-blue-500"
    },
    {
      name: "Gold",
      price: "$599",
      description: "Maximum exposure and comprehensive support",
      features: [
        "Everything in Silver",
        "Top banner placement",
        "Dedicated account manager",
        "Custom marketing campaign",
        "Press release distribution",
        "Investor introductions",
        "24/7 priority support"
      ],
      popular: false,
      color: "border-yellow-500"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Cost-Effective Solutions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Launch your project without breaking the bank. Our platform offers unmatched value 
            with transparent pricing and comprehensive features that deliver real results.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                {benefit.title}
              </h3>
              
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                {benefit.price}
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {benefit.description}
              </p>
              
              <ul className="space-y-2">
                {benefit.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-8">
            Choose Your Plan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-slate-700 rounded-2xl p-6 border-2 ${tier.color} ${
                  tier.popular ? 'shadow-xl scale-105' : 'shadow-lg'
                } transition-all duration-300 hover:shadow-xl`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {tier.name}
                  </h4>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                    {tier.price}
                  </div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {tier.offer}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {tier.description}
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1'
                    : 'bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-500'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-500/10 dark:to-blue-500/10 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8 text-emerald-600" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              Proven ROI
            </h3>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-3xl mx-auto">
            Our clients typically see a 300% return on their listing investment through increased visibility, 
            investor connections, and successful funding rounds. Join the success stories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">300%</div>
              <div className="text-slate-600 dark:text-slate-300">Average ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">$5.40M+</div>
              <div className="text-slate-600 dark:text-slate-300">Funds Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">84+</div>
              <div className="text-slate-600 dark:text-slate-300">Successful Projects</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostEffectiveSection;