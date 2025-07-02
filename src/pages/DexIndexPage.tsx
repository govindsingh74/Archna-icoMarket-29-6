import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Search, RefreshCw, ExternalLink } from 'lucide-react';
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
  total_supply: string;
}

interface DexData {
  priceUsd: string;
  priceChange: {
    h1: number;
    h24: number;
    h7: number;
  };
  marketCap: number;
  volume: {
    h24: number;
  };
  pair: {
    chartImg: string;
  };
}

interface CombinedTokenData extends TokenData {
  dexData?: DexData;
  loading: boolean;
  error?: string;
}

const DexIndexPage: React.FC = () => {
  const [tokens, setTokens] = useState<CombinedTokenData[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<CombinedTokenData[]>([]);
  const [currentPageTokens, setCurrentPageTokens] = useState<CombinedTokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTokensFromSupabase();
  }, []);

  useEffect(() => {
    filterTokens();
  }, [tokens, searchTerm]);

  useEffect(() => {
    paginateTokens();
  }, [filteredTokens, currentPage, itemsPerPage]);

  const fetchTokensFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('ico_listings')
        .select('id, project_name, project_symbol, logo_url, contract_address, network, total_supply')
        .eq('is_active', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tokensWithLoading = (data || []).map(token => ({
        ...token,
        loading: true
      }));

      setTokens(tokensWithLoading);
      
      // Fetch DEX data for each token
      tokensWithLoading.forEach(token => {
        fetchDexData(token);
      });

    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDexData = async (token: TokenData) => {
    try {
      const searchUrl = `https://api.dexscreener.com/latest/dex/search?q=${token.contract_address}`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0]; // Choose first match
        const dexData: DexData = {
          priceUsd: pair.priceUsd || '0',
          priceChange: {
            h1: pair.priceChange?.h1 || 0,
            h24: pair.priceChange?.h24 || 0,
            h7: pair.priceChange?.h7 || 0 // Note: search API may not return `h7`
          },
          marketCap: pair.marketCap || 0,
          volume: {
            h24: pair.volume?.h24 || 0
          },
          pair: {
            chartImg: pair.info?.imageUrl || ''
          }
        };

        setTokens(prev => prev.map(t => 
          t.id === token.id 
            ? { ...t, dexData, loading: false }
            : t
        ));
      } else {
        setTokens(prev => prev.map(t =>
          t.id === token.id
            ? { ...t, loading: false, error: 'No data found' }
            : t
        ));
      }
    } catch (error) {
      console.error(`Error fetching DEX data for ${token.project_symbol}:`, error);
      setTokens(prev => prev.map(t =>
        t.id === token.id
          ? { ...t, loading: false, error: 'Fetch failed' }
          : t
      ));
    }
  };


  const filterTokens = () => {
    let filtered = [...tokens];

    if (searchTerm) {
      filtered = filtered.filter(token =>
        token.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.project_symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTokens(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  const paginateTokens = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentPageTokens(filteredTokens.slice(startIndex, endIndex));
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }

    const sortedTokens = [...filteredTokens].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (key) {
        case 'price':
          aValue = parseFloat(a.dexData?.priceUsd || '0');
          bValue = parseFloat(b.dexData?.priceUsd || '0');
          break;
        case 'marketCap':
          aValue = a.dexData?.marketCap || 0;
          bValue = b.dexData?.marketCap || 0;
          break;
        case 'volume':
          aValue = a.dexData?.volume.h24 || 0;
          bValue = b.dexData?.volume.h24 || 0;
          break;
        case 'change24h':
          aValue = a.dexData?.priceChange.h24 || 0;
          bValue = b.dexData?.priceChange.h24 || 0;
          break;
        default:
          aValue = a[key as keyof TokenData];
          bValue = b[key as keyof TokenData];
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTokens(sortedTokens);
    setSortConfig({ key, direction });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTokens(prev => prev.map(token => ({ ...token, loading: true })));
    
    tokens.forEach(token => {
      fetchDexData(token);
    });

    setTimeout(() => setRefreshing(false), 2000);
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

  const formatSupply = (supply: string) => {
    const num = parseFloat(supply.replace(/,/g, ''));
    if (isNaN(num)) return supply;
    return formatNumber(num, 0).replace('$', '');
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                DEX Index
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Live cryptocurrency prices and market data powered by Dexscreener API. 
                Track real-time token performance and market trends.
              </p>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="py-8 bg-white dark:bg-slate-800 border-b border-slate-200/50 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value={25}>Show 25</option>
                  <option value={50}>Show 50</option>
                  <option value={75}>Show 75</option>
                  <option value={100}>Show 100</option>
                </select>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTokens.length)} of {filteredTokens.length} tokens
            </div>
          </div>
        </section>

        {/* DEX Table */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th 
                        className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                        onClick={() => handleSort('price')}
                      >
                        Price
                      </th>
                      <th 
                        className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                        onClick={() => handleSort('change1h')}
                      >
                        1h %
                      </th>
                      <th 
                        className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                        onClick={() => handleSort('change24h')}
                      >
                        24h %
                      </th>
                      <th 
                        className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                        onClick={() => handleSort('change7d')}
                      >
                        7d %
                      </th>
                      <th 
                        className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                        onClick={() => handleSort('marketCap')}
                      >
                        Market Cap
                      </th>
                      <th 
                        className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                        onClick={() => handleSort('volume')}
                      >
                        Volume (24h)
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Supply
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        7d Chart
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                    {currentPageTokens.map((token, index) => (
                      <tr key={token.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={token.logo_url}
                              alt={token.project_name}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100';
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {token.project_name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {token.project_symbol}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {token.loading ? (
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-600 h-4 w-16 rounded ml-auto"></div>
                          ) : token.error ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <span className="font-medium text-slate-900 dark:text-white">
                              {formatPrice(token.dexData?.priceUsd || '0')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {token.loading ? (
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-600 h-4 w-12 rounded ml-auto"></div>
                          ) : token.error ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <div className={`flex items-center justify-end gap-1 ${getChangeColor(token.dexData?.priceChange.h1 || 0)}`}>
                              {getChangeIcon(token.dexData?.priceChange.h1 || 0)}
                              <span>{(token.dexData?.priceChange.h1 || 0).toFixed(2)}%</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {token.loading ? (
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-600 h-4 w-12 rounded ml-auto"></div>
                          ) : token.error ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <div className={`flex items-center justify-end gap-1 ${getChangeColor(token.dexData?.priceChange.h24 || 0)}`}>
                              {getChangeIcon(token.dexData?.priceChange.h24 || 0)}
                              <span>{(token.dexData?.priceChange.h24 || 0).toFixed(2)}%</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {token.loading ? (
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-600 h-4 w-12 rounded ml-auto"></div>
                          ) : token.error ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <div className={`flex items-center justify-end gap-1 ${getChangeColor(token.dexData?.priceChange.h7 || 0)}`}>
                              {getChangeIcon(token.dexData?.priceChange.h7 || 0)}
                              <span>{(token.dexData?.priceChange.h7 || 0).toFixed(2)}%</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {token.loading ? (
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-600 h-4 w-16 rounded ml-auto"></div>
                          ) : token.error ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <span className="text-slate-900 dark:text-white">
                              {formatNumber(token.dexData?.marketCap || 0)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {token.loading ? (
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-600 h-4 w-16 rounded ml-auto"></div>
                          ) : token.error ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <span className="text-slate-900 dark:text-white">
                              {formatNumber(token.dexData?.volume.h24 || 0)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900 dark:text-white">
                          {formatSupply(token.total_supply || '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {token.loading ? (
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-600 h-8 w-16 rounded mx-auto"></div>
                          ) : token.error ? (
                            <span className="text-slate-400">-</span>
                          ) : token.dexData?.pair.chartImg ? (
                            <img
                              src={token.dexData.pair.chartImg}
                              alt="7d chart"
                              className="h-8 w-16 mx-auto"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2 text-slate-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page as number)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8 bg-slate-100 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Live Data Powered by Dexscreener
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Real-time cryptocurrency prices and market data. Data refreshes automatically every few minutes.
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>• Live Prices</span>
                <span>• Market Cap</span>
                <span>• 24h Volume</span>
                <span>• Price Changes</span>
                <span>• 7d Charts</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DexIndexPage;