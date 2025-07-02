import React, { useState } from 'react';
import { X, Upload, Calendar, Globe, FileText, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ICOListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  listingType: 'free' | 'silver' | 'gold';
  projectName: string;
  projectSymbol: string;
  totalSupply: string;
  contractAddress: string;
  relationshipWithProject: string;
  projectLaunchDate: string;
  countryOfOrigin: string;
  projectTags: string;
  projectDescription: string;
  projectKeypoints: string;
  network: string;
  decimals: number;
  logoUrl: string;
  websiteUrl: string;
  blockExplorerLink: string;
  whitepaperLink: string;
  twitterUrl: string;
  telegramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  icoStartDate: string;
  icoEndDate: string;
  icoPrice: string;
  comments: string;
}

const ICOListingModal: React.FC<ICOListingModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    listingType: 'free',
    projectName: '',
    projectSymbol: '',
    totalSupply: '',
    contractAddress: '',
    relationshipWithProject: '',
    projectLaunchDate: '',
    countryOfOrigin: '',
    projectTags: '',
    projectDescription: '',
    projectKeypoints: '',
    network: 'Ethereum (ETH)',
    decimals: 18,
    logoUrl: '',
    websiteUrl: '',
    blockExplorerLink: '',
    whitepaperLink: '',
    twitterUrl: '',
    telegramUrl: '',
    facebookUrl: '',
    linkedinUrl: '',
    icoStartDate: '',
    icoEndDate: '',
    icoPrice: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.projectSymbol.trim()) newErrors.projectSymbol = 'Project symbol is required';
    if (!formData.contractAddress.trim()) newErrors.contractAddress = 'Contract address is required';
    if (!formData.relationshipWithProject.trim()) newErrors.relationshipWithProject = 'Relationship with project is required';
    if (!formData.countryOfOrigin.trim()) newErrors.countryOfOrigin = 'Country of origin is required';
    if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Project description is required';
    else if (formData.projectDescription.length < 120) newErrors.projectDescription = 'Description must be at least 120 characters';
    if (!formData.logoUrl.trim()) newErrors.logoUrl = 'Logo URL is required';
    if (!formData.websiteUrl.trim()) newErrors.websiteUrl = 'Website URL is required';
    if (!formData.blockExplorerLink.trim()) newErrors.blockExplorerLink = 'Block explorer link is required';
    if (!formData.whitepaperLink.trim()) newErrors.whitepaperLink = 'Whitepaper link is required';
    if (!formData.icoStartDate) newErrors.icoStartDate = 'ICO start date is required';
    if (!formData.icoEndDate) newErrors.icoEndDate = 'ICO end date is required';
    if (!formData.icoPrice.trim()) newErrors.icoPrice = 'ICO price is required';

    // URL validation
    const urlFields = ['logoUrl', 'websiteUrl', 'blockExplorerLink', 'whitepaperLink', 'twitterUrl', 'telegramUrl', 'facebookUrl', 'linkedinUrl'];
    urlFields.forEach(field => {
      const value = formData[field as keyof FormData] as string;
      if (value && !isValidUrl(value)) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

    // Date validation
    if (formData.icoStartDate && formData.icoEndDate) {
      if (new Date(formData.icoStartDate) >= new Date(formData.icoEndDate)) {
        newErrors.icoEndDate = 'End date must be after start date';
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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert('You must be logged in to submit a project listing.');
        return;
      }

      // Insert the ICO listing
      const { error } = await supabase
        .from('ico_listings')
        .insert({
          user_id: user.id,
          listing_type: formData.listingType,
          project_name: formData.projectName,
          project_symbol: formData.projectSymbol,
          total_supply: formData.totalSupply,
          contract_address: formData.contractAddress,
          relationship_with_project: formData.relationshipWithProject,
          project_launch_date: formData.projectLaunchDate || null,
          country_of_origin: formData.countryOfOrigin,
          project_tags: formData.projectTags,
          project_description: formData.projectDescription,
          project_keypoints: formData.projectKeypoints,
          network: formData.network,
          decimals: formData.decimals,
          logo_url: formData.logoUrl,
          website_url: formData.websiteUrl,
          block_explorer_link: formData.blockExplorerLink,
          whitepaper_link: formData.whitepaperLink,
          twitter_url: formData.twitterUrl || null,
          telegram_url: formData.telegramUrl || null,
          facebook_url: formData.facebookUrl || null,
          linkedin_url: formData.linkedinUrl || null,
          ico_start_date: formData.icoStartDate,
          ico_end_date: formData.icoEndDate,
          ico_price: formData.icoPrice,
          comments: formData.comments || null
        });

      if (error) throw error;

      alert('Project submitted successfully! It will be reviewed before being published.');
      onClose();
      
      // Reset form
      setFormData({
        listingType: 'free',
        projectName: '',
        projectSymbol: '',
        totalSupply: '',
        contractAddress: '',
        relationshipWithProject: '',
        projectLaunchDate: '',
        countryOfOrigin: '',
        projectTags: '',
        projectDescription: '',
        projectKeypoints: '',
        network: 'Ethereum (ETH)',
        decimals: 18,
        logoUrl: '',
        websiteUrl: '',
        blockExplorerLink: '',
        whitepaperLink: '',
        twitterUrl: '',
        telegramUrl: '',
        facebookUrl: '',
        linkedinUrl: '',
        icoStartDate: '',
        icoEndDate: '',
        icoPrice: '',
        comments: ''
      });

    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Error submitting project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">List New Project</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Select Listing Type */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Select Listing Type
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {['free', 'silver', 'gold'].map((type) => (
                  <label key={type} className="relative">
                    <input
                      type="radio"
                      name="listingType"
                      value={type}
                      checked={formData.listingType === type}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.listingType === type
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}>
                      <div className="text-center">
                        <div className="font-semibold text-slate-800 dark:text-white capitalize">{type}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Project Details
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                [Project's full name] - [Symbol] - [Total Supply] - [Contract Address]<br/>
                Example: MyCoin - MYC - 1,000,000,000 - 0x123...
              </p>
              
              {/* Project Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.projectName ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.projectName && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Project Symbol *
                  </label>
                  <input
                    type="text"
                    name="projectSymbol"
                    value={formData.projectSymbol}
                    onChange={handleInputChange}
                    placeholder="e.g., BTC, ETH, USDT"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.projectSymbol ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.projectSymbol && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectSymbol}</p>
                  )}
                </div>
              </div>

              {/* Total Supply and Contract Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Total Supply
                  </label>
                  <input
                    type="text"
                    name="totalSupply"
                    value={formData.totalSupply}
                    onChange={handleInputChange}
                    placeholder="e.g., 1,000,000,000"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Contract Address *
                  </label>
                  <input
                    type="text"
                    name="contractAddress"
                    value={formData.contractAddress}
                    onChange={handleInputChange}
                    placeholder="0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.contractAddress ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.contractAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.contractAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Relationship */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Relationship with the Project
              </h3>
              <input
                type="text"
                name="relationshipWithProject"
                value={formData.relationshipWithProject}
                onChange={handleInputChange}
                placeholder="e.g., Founder, Team Member, Marketing Partner"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.relationshipWithProject ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.relationshipWithProject && (
                <p className="text-red-500 text-sm">{errors.relationshipWithProject}</p>
              )}
            </div>

            {/* 4. Project Launch Date */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Project Launch Date
              </h3>
              <input
                type="date"
                name="projectLaunchDate"
                value={formData.projectLaunchDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* 5. Country of Origin */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                Country of Origin
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Where majority of team is located</p>
              <input
                type="text"
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleInputChange}
                placeholder="Enter country name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.countryOfOrigin ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.countryOfOrigin && (
                <p className="text-red-500 text-sm">{errors.countryOfOrigin}</p>
              )}
            </div>

            {/* 6. Project Tags */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                Project Tags - Sector/Categories
              </h3>
              <input
                type="text"
                name="projectTags"
                value={formData.projectTags}
                onChange={handleInputChange}
                placeholder="e.g., DeFi, Gaming, NFT, Metaverse (comma separated)"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* 7. Project Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
                Project Short Description * (minimum 120 characters)
              </h3>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your project in detail..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.projectDescription ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formData.projectDescription.length}/120 characters minimum
              </p>
              {errors.projectDescription && (
                <p className="text-red-500 text-sm">{errors.projectDescription}</p>
              )}
            </div>

            {/* 8. Project Key-points */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">8</span>
                Project Key-points
              </h3>
              <textarea
                name="projectKeypoints"
                value={formData.projectKeypoints}
                onChange={handleInputChange}
                rows={3}
                placeholder="List the main features and benefits of your project"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* 9. Network */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                Network *
              </h3>
              <select
                name="network"
                value={formData.network}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                <option value="Binance Smart Chain (BSC)">Binance Smart Chain (BSC)</option>
                <option value="Polygon (MATIC)">Polygon (MATIC)</option>
                <option value="Solana (SOL)">Solana (SOL)</option>
                <option value="Avalanche (AVAX)">Avalanche (AVAX)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Number of Decimals */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Number of Decimals *</h3>
              <input
                type="number"
                name="decimals"
                value={formData.decimals}
                onChange={handleInputChange}
                min="0"
                max="18"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* 10. Logo URL */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">10</span>
                Link to Logo
              </h3>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.logoUrl ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.logoUrl && (
                <p className="text-red-500 text-sm">{errors.logoUrl}</p>
              )}
            </div>

            {/* 11. Website URL */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">11</span>
                Project Website *
              </h3>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="https://yourproject.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.websiteUrl ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.websiteUrl && (
                <p className="text-red-500 text-sm">{errors.websiteUrl}</p>
              )}
            </div>

            {/* Block Explorer Link */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Block Explorer Link *</h3>
              <input
                type="url"
                name="blockExplorerLink"
                value={formData.blockExplorerLink}
                onChange={handleInputChange}
                placeholder="https://etherscan.io/token/0x..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.blockExplorerLink ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.blockExplorerLink && (
                <p className="text-red-500 text-sm">{errors.blockExplorerLink}</p>
              )}
            </div>

            {/* Whitepaper Link */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Whitepaper / Technical Documentation Link *</h3>
              <input
                type="url"
                name="whitepaperLink"
                value={formData.whitepaperLink}
                onChange={handleInputChange}
                placeholder="https://yourproject.com/whitepaper.pdf"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.whitepaperLink ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.whitepaperLink && (
                <p className="text-red-500 text-sm">{errors.whitepaperLink}</p>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Social Links *
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    X (Twitter) URL
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/yourproject"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.twitterUrl ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.twitterUrl && (
                    <p className="text-red-500 text-sm">{errors.twitterUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Telegram URL
                  </label>
                  <input
                    type="url"
                    name="telegramUrl"
                    value={formData.telegramUrl}
                    onChange={handleInputChange}
                    placeholder="https://t.me/yourproject"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.telegramUrl ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.telegramUrl && (
                    <p className="text-red-500 text-sm">{errors.telegramUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/yourproject"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.facebookUrl ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.facebookUrl && (
                    <p className="text-red-500 text-sm">{errors.facebookUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/company/yourproject"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.linkedinUrl ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.linkedinUrl && (
                    <p className="text-red-500 text-sm">{errors.linkedinUrl}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ICO Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">ICO/IEO Start Date *</h3>
                <input
                  type="date"
                  name="icoStartDate"
                  value={formData.icoStartDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.icoStartDate ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.icoStartDate && (
                  <p className="text-red-500 text-sm">{errors.icoStartDate}</p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">ICO/IEO End Date *</h3>
                <input
                  type="date"
                  name="icoEndDate"
                  value={formData.icoEndDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.icoEndDate ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.icoEndDate && (
                  <p className="text-red-500 text-sm">{errors.icoEndDate}</p>
                )}
              </div>
            </div>

            {/* ICO Price */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">ICO/IEO/Launch Price [Price/Native Currency] *</h3>
              <input
                type="text"
                name="icoPrice"
                value={formData.icoPrice}
                onChange={handleInputChange}
                placeholder="e.g., 0.001 ETH or $0.10"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.icoPrice ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.icoPrice && (
                <p className="text-red-500 text-sm">{errors.icoPrice}</p>
              )}
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Comments and/or Questions</h3>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional information or questions you'd like to share"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ICOListingModal;