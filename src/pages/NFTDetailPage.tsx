import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  Twitter, 
  Copy,
  Tag,
  User,
  Calendar,
  Network,
  Palette
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface NFTDetail {
  id: string;
  nft_name: string;
  image_url: string;
  collection_name: string;
  description: string;
  blockchain: string;
  token_id: string;
  contract_address: string;
  creator_name: string;
  nft_url: string;
  creator_wallet?: string;
  metadata_url?: string;
  tags?: string;
  twitter?: string;
  website?: string;
  created_at: string;
}

const NFTDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nft, setNft] = useState<NFTDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchNFTDetails(id);
    }
  }, [id]);

  const fetchNFTDetails = async (nftId: string) => {
    try {
      const { data, error } = await supabase
        .from('nft_listings')
        .select('*')
        .eq('id', nftId)
        .eq('is_active', true)
        .eq('is_approved', true)
        .single();

      if (error) throw error;
      
      setNft(data);
    } catch (error) {
      console.error('Error fetching NFT details:', error);
      setError('NFT not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateAddress = (address: string, startLength = 6, endLength = 4) => {
    if (address.length <= startLength + endLength) return address;
    return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              {error || 'NFT not found'}
            </h1>
            <button
              onClick={() => navigate('/nft-index')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to NFT Index
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
              onClick={() => navigate('/nft-index')}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to NFT Index</span>
            </button>
          </div>
        </div>

        {/* NFT Details */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: NFT Image */}
              <div className="space-y-6">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-2xl">
                  <img
                    src={nft.image_url}
                    alt={nft.nft_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                      {nft.blockchain}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  <a
                    href={nft.nft_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View on Marketplace</span>
                  </a>
                  {nft.metadata_url && (
                    <a
                      href={nft.metadata_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Metadata
                    </a>
                  )}
                </div>
              </div>

              {/* Right: NFT Information */}
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                    <Palette className="w-5 h-5" />
                    <span className="text-sm font-medium">{nft.collection_name}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                    {nft.nft_name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {nft.description}
                  </p>
                </div>

                {/* Creator Info */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Creator Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Name</span>
                      <span className="font-medium text-slate-800 dark:text-white">{nft.creator_name}</span>
                    </div>
                    {nft.creator_wallet && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Wallet</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-800 dark:text-white">
                            {truncateAddress(nft.creator_wallet)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(nft.creator_wallet!, 'wallet')}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {copiedField === 'wallet' && (
                            <span className="text-green-500 text-xs">Copied!</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Technical Details
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Blockchain</div>
                        <div className="font-medium text-slate-800 dark:text-white">{nft.blockchain}</div>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Token ID</div>
                        <div className="font-mono text-slate-800 dark:text-white">{nft.token_id}</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Contract Address</div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-slate-800 dark:text-white">
                          {truncateAddress(nft.contract_address, 10, 6)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(nft.contract_address, 'contract')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copiedField === 'contract' && (
                          <span className="text-green-500 text-xs">Copied!</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Listed On</div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-800 dark:text-white">{formatDate(nft.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {nft.tags && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {nft.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(nft.twitter || nft.website) && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                      Links
                    </h3>
                    <div className="flex gap-4">
                      {nft.twitter && (
                        <a
                          href={nft.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          <span>Twitter</span>
                        </a>
                      )}
                      {nft.website && (
                        <a
                          href={nft.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NFTDetailPage;