import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, ExternalLink, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface NFTListing {
  id: string;
  nft_name: string;
  image_url: string;
  collection_name: string;
  description: string;
  blockchain: string;
  creator_name: string;
  nft_url: string;
  tags?: string;
  created_at: string;
}

const NFTIndexPage: React.FC = () => {
  const [nfts, setNfts] = useState<NFTListing[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTListing[]>([]);
  const [currentPageNfts, setCurrentPageNfts] = useState<NFTListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [blockchainFilter, setBlockchainFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNFTs();
  }, []);

  useEffect(() => {
    filterNFTs();
  }, [nfts, searchTerm, blockchainFilter]);

  useEffect(() => {
    paginateNFTs();
  }, [filteredNfts, currentPage, itemsPerPage]);

  const fetchNFTs = async () => {
    try {
      const { data, error } = await supabase
        .from('nft_listings')
        .select('*')
        .eq('is_active', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setNfts(data || []);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNFTs = () => {
    let filtered = [...nfts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(nft =>
        nft.nft_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.collection_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.creator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Blockchain filter
    if (blockchainFilter !== 'all') {
      filtered = filtered.filter(nft => nft.blockchain === blockchainFilter);
    }

    setFilteredNfts(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const paginateNFTs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentPageNfts(filteredNfts.slice(startIndex, endIndex));
  };

  const getUniqueBlockchains = () => {
    const blockchains = nfts.map(nft => nft.blockchain);
    return [...new Set(blockchains)];
  };

  const handleViewDetails = (nftId: string) => {
    window.location.href = `/nft/${nftId}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
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
        <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-purple-900 dark:to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Palette className="w-8 h-8 text-purple-600" />
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white">
                  NFT Index
                </h1>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Discover and explore unique NFTs from talented creators around the world. 
                Find your next digital collectible in our curated marketplace.
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
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <select
                  value={blockchainFilter}
                  onChange={(e) => setBlockchainFilter(e.target.value)}
                  className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="all">All Blockchains</option>
                  {getUniqueBlockchains().map(blockchain => (
                    <option key={blockchain} value={blockchain}>{blockchain}</option>
                  ))}
                </select>

                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value={15}>Show 15</option>
                  <option value={20}>Show 20</option>
                  <option value={30}>Show 30</option>
                  <option value={40}>Show 40</option>
                  <option value={50}>Show 50</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-600 text-purple-600 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-600 text-purple-600 shadow-sm'
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
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredNfts.length)} of {filteredNfts.length} NFTs
            </div>
          </div>
        </section>

        {/* NFTs Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {currentPageNfts.length > 0 ? (
              <>
                <div className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}>
                  {currentPageNfts.map((nft) => (
                    <div
                      key={nft.id}
                      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-white/10 hover:border-slate-300/50 dark:hover:border-white/20"
                    >
                      {/* NFT Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={nft.image_url}
                          alt={nft.nft_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400';
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                            {nft.blockchain}
                          </span>
                        </div>
                      </div>

                      {/* NFT Info */}
                      <div className="p-6">
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {nft.nft_name}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            {nft.collection_name}
                          </p>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                          {truncateDescription(nft.description)}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Creator</p>
                            <p className="text-sm font-medium text-slate-800 dark:text-white">
                              {nft.creator_name}
                            </p>
                          </div>
                          {nft.tags && (
                            <div className="flex flex-wrap gap-1">
                              {nft.tags.split(',').slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs rounded-full"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={() => handleViewDetails(nft.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors group/btn"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
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
                                    ? 'bg-purple-600 text-white'
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
                  <Filter className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  No NFTs Found
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Try adjusting your search criteria or filters to find more NFTs.
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

export default NFTIndexPage;