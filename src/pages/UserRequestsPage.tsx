import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  Edit, 
  Megaphone, 
  Send, 
  CheckCircle,
  Upload,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

type RequestType = 'partner' | 'influencer' | 'update_project' | 'show_ads';

interface FormData {
  type: RequestType;
  fullName: string;
  email: string;
  companyName: string;
  website: string;
  socialHandle: string;
  platform: string;
  projectId: string;
  projectName: string;
  description: string;
  features: string;
  documentUrl: string;
  adLink: string;
  adDuration: string;
}

const UserRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RequestType>('partner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    type: 'partner',
    fullName: '',
    email: '',
    companyName: '',
    website: '',
    socialHandle: '',
    platform: '',
    projectId: '',
    projectName: '',
    description: '',
    features: '',
    documentUrl: '',
    adLink: '',
    adDuration: ''
  });

  const menuItems = [
    {
      id: 'partner' as RequestType,
      title: 'Partner With Us',
      icon: Users,
      description: 'Join our partnership program'
    },
    {
      id: 'influencer' as RequestType,
      title: 'Influencer',
      icon: Star,
      description: 'Become a brand ambassador'
    },
    {
      id: 'update_project' as RequestType,
      title: 'Update Project Details',
      icon: Edit,
      description: 'Update your project information'
    },
    {
      id: 'show_ads' as RequestType,
      title: 'Show Ads',
      icon: Megaphone,
      description: 'Advertise your project'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTabChange = (tab: RequestType) => {
    setActiveTab(tab);
    setFormData(prev => ({ ...prev, type: tab }));
    setErrors({});
    setSuccessMessage('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Common validations
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    // Type-specific validations
    switch (activeTab) {
      case 'partner':
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (formData.website && !isValidUrl(formData.website)) newErrors.website = 'Please enter a valid URL';
        break;
      case 'influencer':
        if (!formData.socialHandle.trim()) newErrors.socialHandle = 'Social media handle is required';
        if (!formData.platform) newErrors.platform = 'Platform is required';
        break;
      case 'update_project':
        if (!formData.projectId.trim()) newErrors.projectId = 'Project ID is required';
        if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
        break;
      case 'show_ads':
        if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
        if (!formData.adLink.trim()) newErrors.adLink = 'Project link is required';
        else if (!isValidUrl(formData.adLink)) newErrors.adLink = 'Please enter a valid URL';
        if (!formData.adDuration) newErrors.adDuration = 'Duration is required';
        break;
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
        setErrors({ general: 'You must be logged in to submit a request.' });
        return;
      }

      // Prepare data for insertion
      const insertData = {
        type: activeTab,
        full_name: formData.fullName,
        email: formData.email,
        company_name: formData.companyName || null,
        website: formData.website || null,
        social_handle: formData.socialHandle || null,
        platform: formData.platform || null,
        project_id: formData.projectId || null,
        project_name: formData.projectName || null,
        description: formData.description,
        features: formData.features || null,
        document_url: formData.documentUrl || null,
        ad_link: formData.adLink || null,
        ad_duration: formData.adDuration || null
      };

      const { error } = await supabase
        .from('user_requests')
        .insert(insertData);

      if (error) throw error;

      setSuccessMessage('Your request has been submitted successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        type: activeTab,
        fullName: '',
        email: '',
        companyName: '',
        website: '',
        socialHandle: '',
        platform: '',
        projectId: '',
        projectName: '',
        description: '',
        features: '',
        documentUrl: '',
        adLink: '',
        adDuration: ''
      });

    } catch (error) {
      console.error('Error submitting request:', error);
      setErrors({ general: 'Failed to submit request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'partner':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.fullName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.companyName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Your company name"
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.website ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="https://yourcompany.com"
                />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                How do you want to partner? *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Describe your partnership proposal..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        );

      case 'influencer':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.fullName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Social Media Handle *
                </label>
                <input
                  type="text"
                  name="socialHandle"
                  value={formData.socialHandle}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.socialHandle ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="@yourusername"
                />
                {errors.socialHandle && <p className="text-red-500 text-sm mt-1">{errors.socialHandle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Platform *
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.platform ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select platform</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Other">Other</option>
                </select>
                {errors.platform && <p className="text-red-500 text-sm mt-1">{errors.platform}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Why should we work with you? *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Tell us about your audience, engagement rates, and why you'd be a great fit..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        );

      case 'update_project':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.fullName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project ID *
                </label>
                <input
                  type="text"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.projectId ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Your project ID"
                />
                {errors.projectId && <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.projectName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Your project name"
                />
                {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Update Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Describe what needs to be updated..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Updated Features
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="List new features or improvements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Upload Document (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  name="documentUrl"
                  value={formData.documentUrl}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="https://link-to-your-document.com"
                />
                <Upload className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        );

      case 'show_ads':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Developer Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.fullName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Your name"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.projectName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Your project name"
                />
                {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Duration *
                </label>
                <select
                  name="adDuration"
                  value={formData.adDuration}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                    errors.adDuration ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select duration</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                </select>
                {errors.adDuration && <p className="text-red-500 text-sm mt-1">{errors.adDuration}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Link to Project *
              </label>
              <input
                type="url"
                name="adLink"
                value={formData.adLink}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.adLink ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="https://yourproject.com"
              />
              {errors.adLink && <p className="text-red-500 text-sm mt-1">{errors.adLink}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ad Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Describe your ad and what you want to promote..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                Partner With TokenLaunch
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Join our ecosystem as a partner, influencer, or advertiser. 
                Let's build the future of cryptocurrency together.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg sticky top-24">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
                    Choose Option
                  </h3>
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-lg text-left transition-all duration-300 ${
                          activeTab === item.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className={`text-xs ${
                            activeTab === item.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    {React.createElement(menuItems.find(item => item.id === activeTab)?.icon || Users, {
                      className: "w-6 h-6 text-blue-600"
                    })}
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      {menuItems.find(item => item.id === activeTab)?.title}
                    </h2>
                  </div>

                  {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-green-600 dark:text-green-400">{successMessage}</p>
                      </div>
                    </div>
                  )}

                  {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                      <p className="text-red-600 dark:text-red-400">{errors.general}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {renderForm()}

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Send className="w-5 h-5" />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
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

export default UserRequestsPage;