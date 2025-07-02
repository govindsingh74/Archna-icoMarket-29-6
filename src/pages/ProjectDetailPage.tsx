import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Twitter, 
  MessageCircle, 
  Facebook, 
  Linkedin, 
  FileText, 
  ExternalLink,
  Calendar,
  Clock,
  Network,
  Coins,
  Users,
  MapPin,
  Tag
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DexData from '../components/DexData';

interface ProjectDetail {
  id: string;
  project_name: string;
  project_symbol: string;
  project_description: string;
  project_keypoints?: string;
  logo_url: string;
  website_url: string;
  twitter_url?: string;
  telegram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  whitepaper_link: string;
  block_explorer_link: string;
  ico_start_date: string;
  ico_end_date: string;
  ico_price: string;
  network: string;
  project_tags?: string;
  listing_type: 'free' | 'silver' | 'gold';
  total_supply?: string;
  decimals: number;
  contract_address: string;
  country_of_origin: string;
  project_launch_date?: string;
  created_at: string;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
  }, [id]);

  const fetchProjectDetails = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('ico_listings')
        .select('*')
        .eq('id', projectId)
        .eq('is_active', true)
        .eq('is_approved', true)
        .single();

      if (error) throw error;

      console.log("Project data from Supabase:", data); // <-- Add this
      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Project not found or unavailable');
    } finally {
      setLoading(false);
    }
  };


  const getProjectStatus = () => {
    if (!project) return { status: 'unknown', color: 'bg-gray-500', textColor: 'text-gray-700' };
    
    const now = new Date();
    const startDate = new Date(project.ico_start_date);
    const endDate = new Date(project.ico_end_date);

    if (now < startDate) {
      return { 
        status: 'upcoming', 
        color: 'bg-orange-500', 
        textColor: 'text-orange-700 dark:text-orange-300',
        bgColor: 'bg-orange-50 dark:bg-orange-500/10'
      };
    } else if (now >= startDate && now <= endDate) {
      return { 
        status: 'live', 
        color: 'bg-green-500', 
        textColor: 'text-green-700 dark:text-green-300',
        bgColor: 'bg-green-50 dark:bg-green-500/10'
      };
    } else {
      return { 
        status: 'completed', 
        color: 'bg-gray-500', 
        textColor: 'text-gray-700 dark:text-gray-300',
        bgColor: 'bg-gray-50 dark:bg-gray-500/10'
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getListingBadge = (type: string) => {
    switch (type) {
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    }
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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              {error || 'Project not found'}
            </h1>
            <button
              onClick={() => navigate('/ico')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to ICO Listings
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const status = getProjectStatus();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Back Button */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200/50 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/ico')}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to ICO Listings</span>
            </button>
          </div>
        </div>

        {/* Project Header */}
        <section className="bg-white dark:bg-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Project Info */}
              <div className="flex-1">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 p-3 shadow-lg">
                    <img
                      src={project.logo_url}
                      alt={`${project.project_name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=200';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                          {project.project_name}
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
                          ${project.project_symbol}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getListingBadge(project.listing_type)}`}>
                          {project.listing_type}
                        </span>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
                          <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                          <span className={`text-sm font-medium uppercase ${status.textColor}`}>
                            {status.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {project.project_tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.project_tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-lg font-bold text-slate-800 dark:text-white">
                          {project.ico_price}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Price</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-lg font-bold text-slate-800 dark:text-white">
                          {project.network}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Network</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-lg font-bold text-slate-800 dark:text-white">
                          {project.total_supply || 'N/A'}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Total Supply</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-lg font-bold text-slate-800 dark:text-white">
                          {project.decimals}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Decimals</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Project Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    About {project.project_name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {project.project_description}
                  </p>
                  
                  {project.project_keypoints && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                        Key Features
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {project.project_keypoints}
                      </p>
                    </div>
                  )}
                </div>

                {/* ICO Timeline */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                    ICO Timeline
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">Start Date</div>
                        <div className="text-slate-600 dark:text-slate-300">{formatDate(project.ico_start_date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <Clock className="w-6 h-6 text-red-600" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">End Date</div>
                        <div className="text-slate-600 dark:text-slate-300">{formatDate(project.ico_end_date)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                    Technical Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Network className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-800 dark:text-white">Network</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{project.network}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-slate-800 dark:text-white">Contract Address</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm break-all">{project.contract_address}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-slate-800 dark:text-white">Country</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{project.country_of_origin}</p>
                    </div>
                    {project.project_launch_date && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold text-slate-800 dark:text-white">Launch Date</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{formatDate(project.project_launch_date)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {project.contract_address && project.network && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <DexData 
                      contractAddress={project.contract_address} 
                      network={project.network} 
                    />
                  </div>
                )}
              </div>

              {/* Right: Sidebar Panels */}
              <div className="space-y-6">
                {/* Social Media Links */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Social Media
                  </h3>
                  <div className="space-y-3">
                    {project.website_url && (
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
                      >
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Website</span>
                        <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                      </a>
                    )}
                    {project.twitter_url && (
                      <a
                        href={project.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
                      >
                        <Twitter className="w-5 h-5 text-blue-400" />
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Twitter</span>
                        <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                      </a>
                    )}
                    {project.telegram_url && (
                      <a
                        href={project.telegram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
                      >
                        <MessageCircle className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Telegram</span>
                        <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                      </a>
                    )}
                    {project.facebook_url && (
                      <a
                        href={project.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Facebook</span>
                        <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                      </a>
                    )}
                    {project.linkedin_url && (
                      <a
                        href={project.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
                      >
                        <Linkedin className="w-5 h-5 text-blue-700" />
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">LinkedIn</span>
                        <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Documentation */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentation
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={project.whitepaper_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
                    >
                      <FileText className="w-5 h-5 text-red-600" />
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Whitepaper</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                    </a>
                    <a
                      href={project.block_explorer_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
                    >
                      <Network className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Block Explorer</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                    </a>
                  </div>
                </div>

                {/* Project Status */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Status
                  </h3>
                  <div className={`p-4 rounded-lg ${status.bgColor} border-l-4 ${status.color.replace('bg-', 'border-')}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                      <span className={`font-semibold uppercase ${status.textColor}`}>
                        {status.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {status.status === 'upcoming' && 'ICO has not started yet'}
                      {status.status === 'live' && 'ICO is currently active'}
                      {status.status === 'completed' && 'ICO has ended'}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {project.project_tags && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.project_tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
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

export default ProjectDetailPage;