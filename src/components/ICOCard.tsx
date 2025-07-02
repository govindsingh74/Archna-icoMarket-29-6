import React from 'react';
import {
  ExternalLink,
  Calendar,
  Globe,
  Twitter,
  MessageCircle,
} from 'lucide-react';

interface ICOProject {
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
  // Optionally add explorer_url?: string;
}

interface ICOCardProps {
  project: ICOProject;
  onViewDetails: (projectId: string) => void;
}

const ICOCard: React.FC<ICOCardProps> = ({ project, onViewDetails }) => {
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
      year: 'numeric',
    });
  };

  const getProjectStatus = () => {
    const now = new Date();
    const startDate = new Date(project.ico_start_date);
    const endDate = new Date(project.ico_end_date);

    if (now < startDate) {
      return {
        status: 'Upcoming',
        color: 'bg-orange-500',
        textColor: 'text-orange-700 dark:text-orange-300',
      };
    } else if (now >= startDate && now <= endDate) {
      return {
        status: 'Live',
        color: 'bg-green-500',
        textColor: 'text-green-700 dark:text-green-300',
      };
    } else {
      return {
        status: 'Completed',
        color: 'bg-gray-500',
        textColor: 'text-gray-700 dark:text-gray-300',
      };
    }
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const status = getProjectStatus();

  return (
    <div className="group bg-slate-50 dark:bg-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700 hover:border-slate-300/50 dark:hover:border-white/20">
      {/* Project Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-slate-600 p-2 shadow-sm">
              <img
                src={project.logo_url}
                alt={`${project.project_name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100';
                }}
              />
            </div>
            <div>
              <h3
                className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                title={project.project_name}
              >
                {project.project_name}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                ${project.project_symbol}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getListingBadge(project.listing_type)}`}
              title={`${project.listing_type} listing`}
            >
              {project.listing_type}
            </span>
            <div className="flex items-center gap-2" title={`Status: ${status.status}`}>
              <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
              <span className={`text-xs font-medium uppercase ${status.textColor}`}>
                {status.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {project.project_tags ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.project_tags.split(',').slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-400 mb-4 block">No tags available</span>
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
              {formatDate(project.ico_start_date)} – {formatDate(project.ico_end_date)}
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
      <div className="px-6 py-4 bg-white/50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Website"
                aria-label="Website"
                className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400" />
              </a>
            )}
            {project.twitter_url && (
              <a
                href={project.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Twitter"
                aria-label="Twitter"
                className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <Twitter className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400" />
              </a>
            )}
            {project.telegram_url && (
              <a
                href={project.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Telegram"
                aria-label="Telegram"
                className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400" />
              </a>
            )}

            {/* Optionally: Add Explorer link */}
            {/* {project.explorer_url && (
              <a
                href={project.explorer_url}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Explorer"
                aria-label="Explorer"
                className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </a>
            )} */}
          </div>
          <button
            onClick={() => onViewDetails(project.id)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors group/btn"
            aria-label="View project details"
          >
            <span>View Details</span>
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ICOCard;
