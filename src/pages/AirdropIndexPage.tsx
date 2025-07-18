import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, Gift, Calendar, Coins } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AirdropCard from '../components/AirdropCard';

interface Airdrop {
  id: string;
  airdrop_name: string;
  airdrop_symbol: string;
  airdrop_description: string;
  logo_url: string;
  website_url?: string;
  twitter_url?: string;
  telegram_url?: string;
  launch_date: string;
  end_date: string;
  launch_price: string;
  airdrop_amount: string;
  network: string;
  requirements?: string;
}

const AIRDROPS_PER_PAGE = 15;

const AirdropIndexPage: React.FC = () => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [filteredAirdrops, setFilteredAirdrops] = useState<Airdrop[]>([]);
  const [currentPageAirdrops, setCurrentPageAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAirdrops();
  }, []);

  useEffect(() => {
    filterAirdrops();
  }, [airdrops, searchTerm, statusFilter]);

  useEffect(() => {
    paginateAirdrops();
  }, [filteredAirdrops, currentPage]);

  const fetchAirdrops = async () => {
    try {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .eq('is_active', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAirdrops(data || []);
    } catch (error) {
      console.error('Error fetching airdrops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAirdrops = () => {
    let filtered = [...airdrops];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(airdrop =>
        airdrop.airdrop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airdrop.airdrop_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airdrop.airdrop_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(airdrop => {
        const now = new Date();
        const startDate = new Date(airdrop.launch_date);
        const endDate = new Date(airdrop.end_date);

        switch (statusFilter) {
          case 'upcoming':
            return now < startDate;
          case 'live':
            return now >= startDate && now <= endDate;
          case 'completed':
            return now > endDate;
          default:
            return true;
        }
      });
    }

    setFilteredAirdrops(filtered);
    setTotalPages(Math.ceil(filtered.length / AIRDROPS_PER_PAGE));
    setCurrentPage(1);
  };

  const paginateAirdrops = () => {
    const startIndex = (currentPage - 1) * AIRDROPS_PER_PAGE;
    const endIndex = startIndex + AIRDROPS_PER_PAGE;
    setCurrentPageAirdrops(filteredAirdrops.slice(startIndex, endIndex));
  };

  const handleViewDetails = (airdropId: string) => {
    window.location.href = `/airdrop/${airdropId}`;
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
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-800 dark:via-green-900 dark:to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Gift className="w-8 h-8 text-green-600" />
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white">
                  Airdrops
                </h1>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Discover and claim free tokens from the most promising cryptocurrency projects. 
                Don't miss out on exclusive airdrop opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white dark:bg-slate-800 border-b border-slate-200/50 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search airdrops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-600 text-green-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-600 text-green-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Showing {((currentPage - 1) * AIRDROPS_PER_PAGE) + 1}-{Math.min(currentPage * AIRDROPS_PER_PAGE, filteredAirdrops.length)} of {filteredAirdrops.length} airdrops
            </div>
          </div>
        </section>

        {/* Airdrops Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {currentPageAirdrops.length > 0 ? (
              <>
                <div className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}>
                  {currentPageAirdrops.map((airdrop) => (
                    <AirdropCard
                      key={airdrop.id}
                      airdrop={airdrop}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center">
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
                                    ? 'bg-green-600 text-white'
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
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  No Airdrops Found
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Try adjusting your search criteria or check back later for new airdrops.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AirdropIndexPage;