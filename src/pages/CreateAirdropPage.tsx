import React, { useState } from 'react';
import { X, Upload, Calendar, Globe, FileText, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface AirdropFormData {
  airdropName: string;
  airdropSymbol: string;
  airdropDescription: string;
  logoUrl: string;
  contractAddress: string;
  tokenAddress: string;
  totalSupply: string;
  airdropAmount: string;
  launchDate: string;
  endDate: string;
  launchPrice: string;
  network: string;
  websiteUrl: string;
  twitterUrl: string;
  telegramUrl: string;
  whitepaperLink: string;
  requirements: string;
}

const CreateAirdropPage: React.FC = () => {
  const [formData, setFormData] = useState<AirdropFormData>({
    airdropName: '',
    airdropSymbol: '',
    airdropDescription: '',
    logoUrl: '',
    contractAddress: '0x2B1D76595aA6Cd590a9e2B3728371c5A6462cdf1',
    tokenAddress: '0x12bEB562542cbFe1b266dF7A5e6C70Ea5Bc6aFB5',
    totalSupply: '',
    airdropAmount: '',
    launchDate: '',
    endDate: '',
    launchPrice: '',
    network: 'Polygon',
    websiteUrl: '',
    twitterUrl: '',
    telegramUrl: '',
    whitepaperLink: '',
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const networkOptions = [
    'Polygon',
    'Ethereum',
    'Binance Smart Chain',
    'Solana',
    'Avalanche'
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
    if (!formData.airdropName.trim()) newErrors.airdropName = 'Airdrop name is required';
    if (!formData.airdropSymbol.trim()) newErrors.airdropSymbol = 'Airdrop symbol is required';
    if (!formData.airdropDescription.trim()) newErrors.airdropDescription = 'Description is required';
    else if (formData.airdropDescription.length < 50) newErrors.airdropDescription = 'Description must be at least 50 characters';
    if (!formData.logoUrl.trim()) newErrors.logoUrl = 'Logo URL is required';
    else if (!isValidUrl(formData.logoUrl)) newErrors.logoUrl = 'Please enter a valid logo URL';
    if (!formData.airdropAmount.trim()) newErrors.airdropAmount = 'Airdrop amount is required';
    if (!formData.launchDate) newErrors.launchDate = 'Launch date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.launchPrice.trim()) newErrors.launchPrice = 'Launch price is required';

    // URL validation
    const urlFields = ['websiteUrl', 'twitterUrl', 'telegramUrl', 'whitepaperLink'];
    urlFields.forEach(field => {
      const value = formData[field as keyof AirdropFormData] as string;
      if (value && !isValidUrl(value)) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

    // Date validation
    if (formData.launchDate && formData.endDate) {
      if (new Date(formData.launchDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after launch date';
      }
    }

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
        setErrors({ general: 'You must be logged in to create an airdrop.' });
        return;
      }

      // Insert the airdrop
      const { error } = await supabase
        .from('airdrops')
        .insert({
          user_id: user.id,
          airdrop_name: formData.airdropName,
          airdrop_symbol: formData.airdropSymbol,
          airdrop_description: formData.airdropDescription,
          logo_url: formData.logoUrl,
          contract_address: formData.contractAddress,
          token_address: formData.tokenAddress,
          total_supply: formData.totalSupply || null,
          airdrop_amount: formData.airdropAmount,
          launch_date: formData.launchDate,
          end_date: formData.endDate,
          launch_price: formData.launchPrice,
          network: formData.network,
          website_url: formData.websiteUrl || null,
          twitter_url: formData.twitterUrl || null,
          telegram_url: formData.telegramUrl || null,
          whitepaper_link: formData.whitepaperLink || null,
          requirements: formData.requirements || null
        });

      if (error) throw error;

      setSuccessMessage('Airdrop created successfully! It will be reviewed before being published.');
      
      // Reset form
      setFormData({
        airdropName: '',
        airdropSymbol: '',
        airdropDescription: '',
        logoUrl: '',
        contractAddress: '0x2B1D76595aA6Cd590a9e2B3728371c5A6462cdf1',
        tokenAddress: '0x12bEB562542cbFe1b266dF7A5e6C70Ea5Bc6aFB5',
        totalSupply: '',
        airdropAmount: '',
        launchDate: '',
        endDate: '',
        launchPrice: '',
        network: 'Polygon',
        websiteUrl: '',
        twitterUrl: '',
        telegramUrl: '',
        whitepaperLink: '',
        requirements: ''
      });

    } catch (error) {
      console.error('Error creating airdrop:', error);
      setErrors({ general: 'Failed to create airdrop. Please try again.' });
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
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-green-600" />
                Create Airdrop
              </h1>
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
                    <Gift className="w-5 h-5" />
                    Airdrop Creation
                  </h3>
                  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Required fields are marked with *</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Your airdrop will be reviewed before going live</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Default contract addresses are pre-filled</span>
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
                    {/* Basic Information */}
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                        Basic Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Airdrop Name *
                          </label>
                          <input
                            type="text"
                            name="airdropName"
                            value={formData.airdropName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.airdropName ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="Enter airdrop name"
                          />
                          {errors.airdropName && <p className="text-red-500 text-sm mt-1">{errors.airdropName}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Token Symbol *
                          </label>
                          <input
                            type="text"
                            name="airdropSymbol"
                            value={formData.airdropSymbol}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.airdropSymbol ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="e.g., TDEX, BTC, ETH"
                          />
                          {errors.airdropSymbol && <p className="text-red-500 text-sm mt-1">{errors.airdropSymbol}</p>}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Logo URL *
                        </label>
                        <div className="relative">
                          <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type="url"
                            name="logoUrl"
                            value={formData.logoUrl}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.logoUrl ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                        {errors.logoUrl && <p className="text-red-500 text-sm mt-1">{errors.logoUrl}</p>}
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="airdropDescription"
                          value={formData.airdropDescription}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                            errors.airdropDescription ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="Describe your airdrop..."
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {formData.airdropDescription.length}/50 characters minimum
                        </p>
                        {errors.airdropDescription && <p className="text-red-500 text-sm mt-1">{errors.airdropDescription}</p>}
                      </div>
                    </div>

                    {/* Contract Information */}
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                        Contract Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Airdrop Contract Address
                          </label>
                          <input
                            type="text"
                            name="contractAddress"
                            value={formData.contractAddress}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            placeholder="0x..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Token Contract Address
                          </label>
                          <input
                            type="text"
                            name="tokenAddress"
                            value={formData.tokenAddress}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            placeholder="0x..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Total Supply
                          </label>
                          <input
                            type="text"
                            name="totalSupply"
                            value={formData.totalSupply}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            placeholder="e.g., 1,000,000,000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Network
                          </label>
                          <select
                            name="network"
                            value={formData.network}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          >
                            {networkOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Airdrop Details */}
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                        Airdrop Details
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Airdrop Amount *
                          </label>
                          <input
                            type="text"
                            name="airdropAmount"
                            value={formData.airdropAmount}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.airdropAmount ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="e.g., 1000"
                          />
                          {errors.airdropAmount && <p className="text-red-500 text-sm mt-1">{errors.airdropAmount}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Launch Price *
                          </label>
                          <input
                            type="text"
                            name="launchPrice"
                            value={formData.launchPrice}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.launchPrice ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="e.g., $0.10"
                          />
                          {errors.launchPrice && <p className="text-red-500 text-sm mt-1">{errors.launchPrice}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Launch Date *
                          </label>
                          <input
                            type="date"
                            name="launchDate"
                            value={formData.launchDate}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.launchDate ? 'border-red-500' : 'border-slate-300'
                            }`}
                          />
                          {errors.launchDate && <p className="text-red-500 text-sm mt-1">{errors.launchDate}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            End Date *
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.endDate ? 'border-red-500' : 'border-slate-300'
                            }`}
                          />
                          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Requirements
                        </label>
                        <textarea
                          name="requirements"
                          value={formData.requirements}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="e.g., Follow on Twitter, Join Telegram, Hold 100 tokens..."
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
                        Social Links (Optional)
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Website URL
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                              type="url"
                              name="websiteUrl"
                              value={formData.websiteUrl}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                errors.websiteUrl ? 'border-red-500' : 'border-slate-300'
                              }`}
                              placeholder="https://yourproject.com"
                            />
                          </div>
                          {errors.websiteUrl && <p className="text-red-500 text-sm mt-1">{errors.websiteUrl}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Twitter URL
                          </label>
                          <input
                            type="url"
                            name="twitterUrl"
                            value={formData.twitterUrl}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.twitterUrl ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="https://twitter.com/yourproject"
                          />
                          {errors.twitterUrl && <p className="text-red-500 text-sm mt-1">{errors.twitterUrl}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Telegram URL
                          </label>
                          <input
                            type="url"
                            name="telegramUrl"
                            value={formData.telegramUrl}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                              errors.telegramUrl ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="https://t.me/yourproject"
                          />
                          {errors.telegramUrl && <p className="text-red-500 text-sm mt-1">{errors.telegramUrl}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Whitepaper Link
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                              type="url"
                              name="whitepaperLink"
                              value={formData.whitepaperLink}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                                errors.whitepaperLink ? 'border-red-500' : 'border-slate-300'
                              }`}
                              placeholder="https://yourproject.com/whitepaper.pdf"
                            />
                          </div>
                          {errors.whitepaperLink && <p className="text-red-500 text-sm mt-1">{errors.whitepaperLink}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-600">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Gift className="w-5 h-5" />
                        <span>{isSubmitting ? 'Creating...' : 'Create Airdrop'}</span>
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

export default CreateAirdropPage;