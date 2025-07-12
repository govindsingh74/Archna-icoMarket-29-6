import React from 'react';
import { ExternalLink, Shield, Zap, Globe, Users, TrendingUp, Clock, Award, ArrowRight, Coins, PieChart, BarChart3 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const TDEXPage: React.FC = () => {
  const contractAddress = "0x12bEB562542cbFe1b266dF7A5e6c70ea5Bc6aFB5";
  const explorerUrl = "https://polygonscan.com/address/0x12beb562542cbfe1b266df7a5e6c70ea5bc6afb5";

  const polygonBenefits = [
    {
      icon: Shield,
      title: "Layer 2 with Ethereum-level security",
      description: "Inherits Ethereum's robust security while offering enhanced performance"
    },
    {
      icon: Zap,
      title: "Ultra-low transaction fees",
      description: "Transactions cost fractions of a penny, making DeFi accessible to everyone"
    },
    {
      icon: TrendingUp,
      title: "65,000+ TPS capability",
      description: "Lightning-fast transaction processing for seamless user experience"
    },
    {
      icon: Globe,
      title: "Used by top dApps",
      description: "Trusted by Polymarket, Aavegotchi, and thousands of other projects"
    },
    {
      icon: Users,
      title: "Eco-friendly and developer-friendly",
      description: "Sustainable blockchain with excellent developer tools and documentation"
    }
  ];

  const tokenomicsData = [
    { label: "Ecosystem Launch", percentage: 10, amount: "100M", color: "bg-blue-500", description: "Publicly available for sale - open and fair" },
    { label: "Development Team", percentage: 5, amount: "50M", color: "bg-green-500", description: "Team allocation with vesting schedule" },
    { label: "Community Rewards", percentage: 3, amount: "30M", color: "bg-purple-500", description: "Airdrop distribution and community incentives" },
    { label: "DEX Liquidity", percentage: 12, amount: "120M", color: "bg-orange-500", description: "Initial and ongoing liquidity provision" },
    { label: "CEX & Marketing", percentage: 10, amount: "100M", color: "bg-red-500", description: "Exchange listings and marketing support" },
    { label: "Minting Reserve", percentage: 59, amount: "590M", color: "bg-indigo-500", description: "POLL-based distribution and listing fee minting" },
    { label: "Dev/Reserves", percentage: 1, amount: "10M", color: "bg-gray-500", description: "Development reserves and emergency fund" }
  ];

  const roadmapData = [
    {
      year: "2025",
      title: "Foundation & Launch",
      milestones: [
        "TDEX Launch + ICO contract live",
        "Initial listings and liquidity build-up",
        "Community building and early adopter rewards",
        "Basic utility implementation"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "2026",
      title: "Expansion & Integration",
      milestones: [
        "NFT launchpad integrated",
        "DEX Aggregator and cross-chain listing module",
        "Advanced analytics and premium features",
        "Strategic partnerships and integrations"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      year: "2027",
      title: "Governance & Ecosystem",
      milestones: [
        "Influencer/partner payout system in TDEX",
        "Governance features enabled for TDEX holders",
        "Exchange listing & mobile app integration",
        "Full ecosystem maturity and sustainability"
      ],
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-slate-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white leading-tight">
                    TDEX: The Fuel of the Token Index Ecosystem
                  </h1>
                  
                  <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                    TDEX is the fastest-growing community token and the native currency powering our Token Index platform.
                  </p>

                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-white/10">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Contract Address:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded">
                        {contractAddress}
                      </code>
                      <button
                        onClick={() => copyToClipboard(contractAddress)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Copy to clipboard"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                    <p className="text-lg font-semibold mb-2">Hold. List. Earn.</p>
                    <p className="opacity-90">Accelerate the future of on-chain discovery.</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/buy"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <img src="/public/logo.png" alt="Coin Icon" className="w-5 h-5" />
                    <span>Buy TDEX</span>
                  </Link>
                  
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View on Explorer</span>
                  </a>
                </div>
              </div>

              {/* Right Logo */}
              <div className="flex items-center justify-center">
                <div className="relative w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-6xl font-bold">
                    <img
                    src="/public/logo.png"
                    alt="Shield Icon"
                    className="w-16 h-16 text-blue-600 dark:text-blue-400"
                    />
                    TDEX
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-20 blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Network Section */}
        <section className="py-16 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                Built on Polygon – Fast, Secure, Scalable
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                TDEX is deployed on the Polygon network and serves as the primary utility token for project listings, 
                paid promotions, and influencer/partner rewards across our ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {polygonBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 group hover:shadow-lg transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-500/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Token Utility + Tokenomics */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                TDEX Utility & Distribution
              </h2>
              <div className="max-w-4xl mx-auto space-y-4 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  TDEX is the native utility token for listings, promotions, and reward mechanisms. 
                  Users holding TDEX receive priority in <strong>NFT airdrops</strong> and <strong>new token distributions</strong> from projects launching via our index.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Initial Supply</h4>
                    <p className="text-2xl font-bold text-blue-600">100 Million TDEX</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Minted at launch</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Total Supply Cap</h4>
                    <p className="text-2xl font-bold text-purple-600">1 Billion TDEX</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Maximum possible supply</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">ICO Pricing</h4>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800 dark:text-white">1 POLL = 18 TDEX</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800 dark:text-white">1 USD = 100 TDEX</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tokenomics Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 text-center flex items-center justify-center gap-2">
                <PieChart className="w-6 h-6" />
                Token Distribution
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Chart */}
                <div className="space-y-4">
                  {tokenomicsData.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-6 h-6 ${item.color} rounded`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-800 dark:text-white">{item.label}</span>
                          <span className="text-slate-600 dark:text-slate-300">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.amount}</span>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {tokenomicsData.map((item, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 ${item.color} rounded`}></div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">{item.label}</h4>
                        <span className="text-sm text-slate-600 dark:text-slate-400">({item.amount})</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Minting & Circulation Logic */}
        <section className="py-16 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-center gap-2">
                <BarChart3 className="w-8 h-8" />
                Minting Mechanism
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Community-Driven Token</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    TDEX is a <strong>community-driven token</strong>. Only 100M are minted upfront to bootstrap 
                    listings and reward early holders.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-500/10 dark:to-blue-500/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Smart Minting Process</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    New tokens are minted only when users <strong>pay listing fees</strong>, and these fees are:
                  </p>
                  <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Deposited into the liquidity pool
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Matched by minting equivalent tokens for circulation
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Future Sustainability</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Once the full 1 billion cap is reached, all tokens will only be available via secondary markets. 
                    In the future, listing fees will be used to <strong>buy back TDEX from DEXs</strong>, boosting 
                    token value and ecosystem sustainability.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">Minting Flow</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">User Pays Listing Fee</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Project owner pays in TDEX or equivalent</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">Fee Goes to Liquidity</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Fees are added to DEX liquidity pools</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">Equivalent Tokens Minted</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">New TDEX tokens enter circulation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">Ecosystem Growth</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Increased liquidity and token utility</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                Road Ahead
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Our 3-year vision for TDEX and the Token Index ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {roadmapData.map((phase, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${phase.color} text-white rounded-xl mb-6 text-xl font-bold`}>
                    {phase.year}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    {phase.title}
                  </h3>
                  
                  <ul className="space-y-3">
                    {phase.milestones.map((milestone, milestoneIndex) => (
                      <li key={milestoneIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600 dark:text-slate-300">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto">
                <span>View Full Whitepaper</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Using TDEX Today — Power Your Web3 Project
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join the growing ecosystem of projects and investors using TDEX to accelerate 
              the future of decentralized finance and token discovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <Link
                    to="/buy"
                    className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-33"
                  >
                    <img src="/public/logo.png" alt="Coin Icon" className="w-5 h-5" />
                    <span>Buy TDEX</span>
                  </Link>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                <Award className="w-5 h-5" />
                <span>Launch ICO Now</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TDEXPage;