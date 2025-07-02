import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ExternalLink, Globe, Twitter, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UpcomingProject {
  id: string;
  project_name: string;
  project_symbol: string;
  project_description: string;
  logo_url: string;
  website_url: string;
  twitter_url?: string;
  telegram_url?: string;
  ico_start_date: string;
  ico_end_date: string;
  ico_price: string;
  network: string;
  project_tags?: string;
  listing_type: 'free' | 'silver' | 'gold';
}

const UpcomingProjectsSection: React.FC = () => {
  const [upcomingProjects, setUpcomingProjects] = useState<UpcomingProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingProjects();
  }, []);

  const fetchUpcomingProjects = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('ico_listings')
        .select('*')
        .eq('is_active', true)
        .eq('is_approved', true)
        .gt('ico_start_date', today)
        .order('ico_start_date', { ascending: true })
        .limit(3);

      if (error) throw error;
      
      setUpcomingProjects(data || []);
    } catch (error) {
      console.error('Error fetching upcoming projects:', error);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilStart = (startDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const truncateDescription = (description: string, maxLength: number = 120) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Upcoming Projects
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Get ready for the next wave of innovative launches
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-600 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded mb-4"></div>
                <div className="h-20 bg-slate-200 dark:bg-slate-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Upcoming Projects
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Get ready for the next wave of innovative launches
          </p>
        </div>

        {upcomingProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingProjects.map((project) => {
              const daysUntilStart = getDaysUntilStart(project.ico_start_date);
              
              return (
                <div
                  key={project.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-white/10 hover:border-slate-300/50 dark:hover:border-white/20"
                >
                  {/* Countdown Banner */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">
                        {daysUntilStart > 0 ? `Starts in ${daysUntilStart} days` : 'Starting Soon'}
                      </span>
                    </div>
                  </div>

                  {/* Project Header */}
                  <div className="relative p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 p-2 shadow-sm">
                          <img
                            src={project.logo_url}
                            alt={`${project.project_name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.project_name}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 font-medium">
                            ${project.project_symbol}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getListingBadge(project.listing_type)}`}>
                        {project.listing_type}
                      </span>
                    </div>

                    {/* Tags */}
                    {project.project_tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.project_tags.split(',').slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                      {truncateDescription(project.project_description)}
                    </p>

                    {/* ICO Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(project.ico_start_date)} - {formatDate(project.ico_end_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Price:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {project.ico_price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Network:</span>
                        <span className="font-medium text-slate-800 dark:text-white">
                          {project.network}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Footer */}
                  <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-700/50 border-t border-slate-200/50 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {project.website_url && (
                          <a
                            href={project.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                          >
                            <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400" />
                          </a>
                        )}
                        {project.twitter_url && (
                          <a
                            href={project.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                          >
                            <Twitter className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400" />
                          </a>
                        )}
                        {project.telegram_url && (
                          <a
                            href={project.telegram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                          >
                            <MessageCircle className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400" />
                          </a>
                        )}
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors group/btn">
                        <span>Notify Me</span>
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              No Upcoming Projects
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              All current projects have already launched. Check back soon for new opportunities!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingProjectsSection;