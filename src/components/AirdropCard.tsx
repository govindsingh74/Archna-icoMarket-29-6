import React from 'react';
import { ExternalLink, Calendar, Globe, Twitter, MessageCircle, Gift } from 'lucide-react';

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

interface AirdropCardProps {
  airdrop: Airdrop;
  onViewDetails: (airdropId: string) => void;
}

const AirdropCard: React.FC<AirdropCardProps> = ({ airdrop, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAirdropStatus = () => {
    const now = new Date();
    const startDate = new Date(airdrop.launch_date);
    const endDate = new Date(airdrop.end_date);

    if (now < startDate) {
      return { status: 'upcoming', color: 'bg-orange-500', textColor: 'text-orange-700 dark:text-orange-300' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'live', color: 'bg-green-500', textColor: 'text-green-700 dark:text-green-300' };
    } else {
      return { status: 'completed', color: 'bg-gray-500', textColor: 'text-gray-700 dark:text-gray-300' };
    }
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const status = getAirdropStatus();

  return (
    <div className="group bg-slate-50 dark:bg-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-white/10 hover:border-slate-300/50 dark:hover:border-white/20">
      {/* Airdrop Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-slate-600 p-2 shadow-sm">
              <img
                src={airdrop.logo_url}
                alt={`${airdrop.airdrop_name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100';
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {airdrop.airdrop_name}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                ${airdrop.airdrop_symbol}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-600 text-white text-xs font-semibold uppercase rounded-full">
              Airdrop
            </span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
              <span className={`text-xs font-medium uppercase ${status.textColor}`}>
                {status.status}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
          {truncateDescription(airdrop.airdrop_description)}
        </p>

        {/* Airdrop Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(airdrop.launch_date)} - {formatDate(airdrop.end_date)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Amount:</span>
            <span className="font-semibold text-slate-800 dark:text-white">
              {airdrop.airdrop_amount} {airdrop.airdrop_symbol}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Launch Price:</span>
            <span className="font-semibold text-slate-800 dark:text-white">
              {airdrop.launch_price}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Network:</span>
            <span className="font-medium text-slate-800 dark:text-white">
              {airdrop.network}
            </span>
          </div>
        </div>

        {/* Requirements */}
        {airdrop.requirements && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Requirements:</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 rounded-lg p-2">
              {airdrop.requirements}
            </p>
          </div>
        )}
      </div>

      {/* Airdrop Footer */}
      <div className="px-6 py-4 bg-white/50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {airdrop.website_url && (
              <a
                href={airdrop.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-green-600 dark:group-hover/link:text-green-400" />
              </a>
            )}
            {airdrop.twitter_url && (
              <a
                href={airdrop.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <Twitter className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-green-600 dark:group-hover/link:text-green-400" />
              </a>
            )}
            {airdrop.telegram_url && (
              <a
                href={airdrop.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover/link:text-green-600 dark:group-hover/link:text-green-400" />
              </a>
            )}
          </div>
          <button 
            onClick={() => onViewDetails(airdrop.id)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors group/btn"
          >
            <Gift className="w-4 h-4" />
            <span>Claim Airdrop</span>
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirdropCard;