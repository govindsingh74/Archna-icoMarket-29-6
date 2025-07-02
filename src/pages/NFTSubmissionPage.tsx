import React, { useState } from 'react';
import { X, Upload, Palette, Globe, Twitter, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface NFTFormData {
  nftName: string;
  imageUrl: string;
  collectionName: string;
  description: string;
  blockchain: string;
  tokenId: string;
  contractAddress: string;
  creatorName: string;
  nftUrl: string;
  creatorWallet: string;
  metadataUrl: string;
  tags: string;
  twitter: string;
  website: string;
}

const NFTSubmissionPage: React.FC = () => {
  const [formData, setFormData] = useState<NFTFormData>({
    nftName: '',
    imageUrl: '',
    collectionName: '',
    description: '',
    blockchain: 'Ethereum',
    tokenId: '',
    contractAddress: '',
    creatorName: '',
    nftUrl: '',
    creatorWallet: '',
    metadataUrl: '',
    tags: '',
    twitter: '',
    website: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const blockchainOptions = [
    'Ethereum',
    'Polygon',
    'Solana',
    'BNB Chain',
    'Avalanche',
    'Cardano',
    'Tezos',
    'Flow'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.nftName.trim()) newErrors.nftName = 'NFT name is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    else if (!isValidUrl(formData.imageUrl)) newErrors.imageUrl = 'Please enter a valid image URL';
    if (!formData.collectionName.trim()) newErrors.collectionName = 'Collection name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.tokenId.trim()) newErrors.tokenId = 'Token ID is required';
    if (!formData.contractAddress.trim()) newErrors.contractAddress = 'Contract address is required';
    if (!formData.creatorName.trim()) newErrors.creatorName = 'Creator name is required';
    if (!formData.nftUrl.trim()) newErrors.nftUrl = 'NFT marketplace URL is required';
    else if (!isValidUrl(formData.nftUrl)) newErrors.nftUrl = 'Please enter a valid marketplace URL';

    // Optional URL validations
    if (formData.metadataUrl && !isValidUrl(formData.metadataUrl)) newErrors.metadataUrl = 'Please enter a valid metadata URL';
    if (formData.twitter && !isValidUrl(formData.twitter)) newErrors.twitter = 'Please enter a valid Twitter URL';
    if (formData.website && !isValidUrl(formData.website)) newErrors.website = 'Please enter a valid website URL';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setErrors({ general: 'You must be logged in to submit an NFT listing.' });
        return;
      }

      // Insert the NFT listing
      const { error } = await supabase
        .from('nft_listings')
        .insert({
          user_id: user.id,
          nft_name: formData.nftName,
          image_url: formData.imageUrl,
          collection_name: formData.collectionName,
          description: formData.description,
          blockchain: formData.blockchain,
          token_id: formData.tokenId,
          contract_address: formData.contractAddress,
          creator_name: formData.creatorName,
          nft_url: formData.nftUrl,
          creator_wallet: formData.creatorWallet || null,
          metadata_url: formData.metadataUrl || null,
          tags: formData.tags || null,
          twitter: formData.twitter || null,
          website: formData.website || null
        });

      if (error) throw error;

      setSuccessMessage('NFT submitted successfully! It will be reviewed before being published.');
      
      // Reset form
      setFormData({
        nftName: '',
        imageUrl: '',
        collectionName: '',
        description: '',
        blockchain: 'Ethereum',
        tokenId: '',
        contractAddress: '',
        creatorName: '',
        nftUrl: '',
        creatorWallet: '',
        metadataUrl: '',
        tags: '',
        twitter: '',
        website: ''
      });

    } catch (error) {
      console.error('Error submitting NFT:', error);
      setErrors({ general: 'Failed to submit NFT. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Header with Close Button */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200/50 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Submit NFT</h1>
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg sticky top-24">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    NFT Submission
                  </h3>
                  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Required fields are marked with *</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Your NFT will be reviewed before going live</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Only external image URLs are accepted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Form */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                  {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                      <p className="text-green-600 dark:text-green-400">{successMessage}</p>
                    </div>
                  )}

                  {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                      <p className="text-red-600 dark:text-red-400">{errors.general}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Essential Fields */}
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">!</span>
                        Essential Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            NFT Name *
                          </label>
                          <input
                            type="text"
                            name="nftName"
                            value={formData.nftName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.nftName ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="Enter NFT name"
                          />
                          {errors.nftName && <p className="text-red-500 text-sm mt-1">{errors.nftName}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Collection Name *
                          </label>
                          <input
                            type="text"
                            name="collectionName"
                            value={formData.collectionName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.collectionName ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="Enter collection name"
                          />
                          {errors.collectionName && <p className="text-red-500 text-sm mt-1">{errors.collectionName}</p>}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Image URL *
                        </label>
                        <div className="relative">
                          <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.imageUrl ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="https://example.com/nft-image.jpg"
                          />
                        </div>
                        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                            errors.description ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="Describe your NFT..."
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Blockchain *
                          </label>
                          <select
                            name="blockchain"
                            value={formData.blockchain}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          >
                            {blockchainOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Token ID *
                          </label>
                          <input
                            type="text"
                            name="tokenId"
                            value={formData.tokenId}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.tokenId ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="Enter token ID"
                          />
                          {errors.tokenId && <p className="text-red-500 text-sm mt-1">{errors.tokenId}</p>}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Contract Address *
                        </label>
                        <input
                          type="text"
                          name="contractAddress"
                          value={formData.contractAddress}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                            errors.contractAddress ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e"
                        />
                        {errors.contractAddress && <p className="text-red-500 text-sm mt-1">{errors.contractAddress}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Creator Name *
                          </label>
                          <input
                            type="text"
                            name="creatorName"
                            value={formData.creatorName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.creatorName ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="Enter creator name"
                          />
                          {errors.creatorName && <p className="text-red-500 text-sm mt-1">{errors.creatorName}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            NFT Marketplace URL *
                          </label>
                          <input
                            type="url"
                            name="nftUrl"
                            value={formData.nftUrl}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.nftUrl ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="https://opensea.io/assets/..."
                          />
                          {errors.nftUrl && <p className="text-red-500 text-sm mt-1">{errors.nftUrl}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Optional Fields */}
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">+</span>
                        Optional Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Creator Wallet
                          </label>
                          <input
                            type="text"
                            name="creatorWallet"
                            value={formData.creatorWallet}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            placeholder="0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Metadata URL
                          </label>
                          <input
                            type="url"
                            name="metadataUrl"
                            value={formData.metadataUrl}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.metadataUrl ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="https://metadata.example.com/token/123"
                          />
                          {errors.metadataUrl && <p className="text-red-500 text-sm mt-1">{errors.metadataUrl}</p>}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="art, digital, collectible, rare"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Twitter URL
                          </label>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                              type="url"
                              name="twitter"
                              value={formData.twitter}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                errors.twitter ? 'border-red-500' : 'border-slate-300'
                              }`}
                              placeholder="https://twitter.com/creator"
                            />
                          </div>
                          {errors.twitter && <p className="text-red-500 text-sm mt-1">{errors.twitter}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Website URL
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                errors.website ? 'border-red-500' : 'border-slate-300'
                              }`}
                              placeholder="https://creator-website.com"
                            />
                          </div>
                          {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-600">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit NFT'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NFTSubmissionPage;