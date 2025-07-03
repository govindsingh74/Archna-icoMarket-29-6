import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  BarChart3,
  DollarSign,
  Activity,
  Droplets,
  PieChart,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface TokenData {
  id: string;
  project_name: string;
  project_symbol: string;
  logo_url: string;
  contract_address: string;
  network: string;
  listing_type: 'free' | 'silver' | 'gold';
}

interface DexAnalyticsData {
  priceUsd: string;
  priceNative: string;
  priceChange: {
    h1: number;
    h24: number;
    h7: number;
  };
  volume: {
    h1: number;
    h6: number;
    h24: number;
    m5: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  marketCap: number;
  fdv: number;
  txns: {
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
    m5: { buys: number; sells: number };
  };
  chartImg: string;
  pairAddress: string;
  dexId: string;
  url: string;
}

const TokenAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [token, setToken] = useState<TokenData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<DexAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTokenAndAnalytics(id);
    }
  }, [id]);

  const fetchTokenAndAnalytics = async (tokenId: string) => {
    try {
      // Fetch token data from Supabase
      const { data: tokenData, error: tokenError } = await supabase
        .from('ico_listings')
        .select('id, project_name, project_symbol, logo_url, contract_address, network, listing_type')
        .eq('id', tokenId)
        .eq('is_active', true)
        .eq('is_approved', true)
        .single();

      if (tokenError) throw tokenError;

      // Check if token has analytics access (gold or silver)
      if (tokenData.listing_type === 'free') {
        setError('Analytics not available for free listings');
        setLoading(false);
        return;
      }

      setToken(tokenData);

      // Fetch analytics data from Dexscreener
      await fetchAnalyticsData(tokenData);

    } catch (error) {
      console.error('Error fetching token analytics:', error);
      setError('Token not found or analytics unavailable');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async (tokenData: TokenData) => {
    try {
        const apiUrl = `https://api.dexscreener.com/latest/dex/search?q=${tokenData.contract_address}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('Dexscreener response:', data);

        if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];

        const analytics: DexAnalyticsData = {
            priceUsd: pair.priceUsd || '0',
            priceNative: pair.priceNative || '0',
            priceChange: {
            h1: pair.priceChange?.h1 || 0,
            h24: pair.priceChange?.h24 || 0,
            h7: pair.priceChange?.h7 || 0
            },
            volume: {
            h1: pair.volume?.h1 || 0,
            h6: pair.volume?.h6 || 0,
            h24: pair.volume?.h24 || 0,
            m5: pair.volume?.m5 || 0
            },
            liquidity: {
            usd: pair.liquidity?.usd || 0,
            base: pair.liquidity?.base || 0,
            quote: pair.liquidity?.quote || 0
            },
            marketCap: pair.marketCap || 0,
            fdv: pair.fdv || 0,
            txns: {
            h1: { buys: pair.txns?.h1?.buys || 0, sells: pair.txns?.h1?.sells || 0 },
            h6: { buys: pair.txns?.h6?.buys || 0, sells: pair.txns?.h6?.sells || 0 },
            h24: { buys: pair.txns?.h24?.buys || 0, sells: pair.txns?.h24?.sells || 0 },
            m5: { buys: pair.txns?.m5?.buys || 0, sells: pair.txns?.m5?.sells || 0 }
            },
            chartImg: pair.chartImg || '',
            pairAddress: pair.pairAddress || '',
            dexId: pair.dexId || '',
            url: pair.url || ''
        };

        setAnalyticsData(analytics);
        } else {
        console.warn('No analytics data for:', tokenData.contract_address);
        setError(`No analytics data found for this token.`);
        }
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Failed to load analytics data');
    }
    };

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(decimals)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(decimals)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(decimals)}K`;
    } else {
      return `$${num.toFixed(decimals)}`;
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num < 0.01) {
      return `$${num.toFixed(6)}`;
    } else if (num < 1) {
      return `$${num.toFixed(4)}`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getBuySellPercentage = (buys: number, sells: number) => {
    const total = buys + sells;
    if (total === 0) return { buyPercent: 0, sellPercent: 0 };
    return {
      buyPercent: (buys / total) * 100,
      sellPercent: (sells / total) * 100
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              {error || 'Token analytics not available'}
            </h1>
            <button
              onClick={() => navigate('/dex-index')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to DEX Index
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Back Button */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200/50 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/dex-index')}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to DEX Index</span>
            </button>
          </div>
        </div>

        {/* Token Header */}
        <section className="bg-white dark:bg-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={token.logo_url}
                alt={token.project_name}
                className="w-16 h-16 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100';
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                  {token.project_name} – {token.project_symbol}
                </h1>
                <p className="text-slate-600 dark:text-slate-300">Token Analytics</p>
              </div>
              <div className="ml-auto">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${
                  token.listing_type === 'gold' 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                    : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                }`}>
                  {token.listing_type}
                </span>
              </div>
            </div>

            {analyticsData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Price (USD)</h3>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {formatPrice(analyticsData.priceUsd)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Price (Native)</h3>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {parseFloat(analyticsData.priceNative).toFixed(8)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {analyticsData && (
          <>
            {/* Price Change Cards */}
            <section className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Price Changes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: '1 Hour', value: analyticsData.priceChange.h1, icon: Clock },
                    { label: '24 Hours', value: analyticsData.priceChange.h24, icon: Activity },
                    { label: '7 Days', value: analyticsData.priceChange.h7, icon: TrendingUp }
                  ].map((item, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <item.icon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{item.label}</h3>
                      </div>
                      <div className={`flex items-center gap-2 ${getChangeColor(item.value)}`}>
                        {getChangeIcon(item.value)}
                        <span className="text-2xl font-bold">{item.value.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Volume Section */}
            <section className="py-8 bg-white dark:bg-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Volume Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: '5 Minutes', value: analyticsData.volume.m5 },
                    { label: '1 Hour', value: analyticsData.volume.h1 },
                    { label: '6 Hours', value: analyticsData.volume.h6 },
                    { label: '24 Hours', value: analyticsData.volume.h24 }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                      <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{item.label}</h3>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">
                        {formatNumber(item.value)}
                      </p>
                      <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((item.value / analyticsData.volume.h24) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Liquidity Section */}
            <section className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <Droplets className="w-6 h-6" />
                  Liquidity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Total Liquidity</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatNumber(analyticsData.liquidity.usd)}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Base Token</h3>
                    <p className="text-2xl font-bold text-green-600">{formatNumber(analyticsData.liquidity.base)}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Quote Token</h3>
                    <p className="text-2xl font-bold text-purple-600">{formatNumber(analyticsData.liquidity.quote)}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Market Cap & FDV */}
            <section className="py-8 bg-white dark:bg-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  Market Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-8">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Market Cap</h3>
                    <p className="text-3xl font-bold text-blue-600">{formatNumber(analyticsData.marketCap)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-8">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Fully Diluted Valuation</h3>
                    <p className="text-3xl font-bold text-purple-600">{formatNumber(analyticsData.fdv)}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Transactions Grid */}
            <section className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6" />
                  Transaction Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: '5 Minutes', data: analyticsData.txns.m5 },
                    { label: '1 Hour', data: analyticsData.txns.h1 },
                    { label: '6 Hours', data: analyticsData.txns.h6 },
                    { label: '24 Hours', data: analyticsData.txns.h24 }
                  ].map((item, index) => {
                    const { buyPercent, sellPercent } = getBuySellPercentage(item.data.buys, item.data.sells);
                    return (
                      <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{item.label}</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-green-600">Buys</span>
                            <span className="font-bold text-slate-800 dark:text-white">{item.data.buys}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-red-600">Sells</span>
                            <span className="font-bold text-slate-800 dark:text-white">{item.data.sells}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex rounded-full overflow-hidden h-3">
                              <div 
                                className="bg-green-500 transition-all duration-300"
                                style={{ width: `${buyPercent}%` }}
                              ></div>
                              <div 
                                className="bg-red-500 transition-all duration-300"
                                style={{ width: `${sellPercent}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-1">
                              <span>{buyPercent.toFixed(1)}% Buys</span>
                              <span>{sellPercent.toFixed(1)}% Sells</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Chart Section */}
            {analyticsData.chartImg && (
              <section className="py-8 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">7-Day Price Chart</h2>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                    <img
                      src={analyticsData.chartImg}
                      alt="7-day price chart"
                      className="w-full h-64 object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Pair Info */}
            <section className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Pair Information</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Pair Address</h3>
                      <p className="text-sm font-mono text-slate-800 dark:text-white break-all">
                        {analyticsData.pairAddress}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">DEX</h3>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white uppercase">
                        {analyticsData.dexId}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">External Link</h3>
                      {analyticsData.url && (
                        <a
                          href={analyticsData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <span>View on Dexscreener</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TokenAnalyticsPage;