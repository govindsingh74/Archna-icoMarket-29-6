import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface CompanyLogo {
  id: number;
  company_name: string;
  logo_url: string;
  alt_text?: string;
  display_order: number;
}

const CompanySection: React.FC = () => {
  const [companyLogos, setCompanyLogos] = useState<CompanyLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyLogos();
    
    // Set up real-time subscription for logo updates
    const subscription = supabase
      .channel('company_logos_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'company_logos' 
        }, 
        () => {
          fetchCompanyLogos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCompanyLogos = async () => {
    try {
      const { data, error } = await supabase
        .from('company_logos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setCompanyLogos(data || []);
    } catch (error) {
      console.error('Error fetching company logos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white dark:bg-slate-800 border-t border-slate-200/50 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              List Tokens Across All Major Blockchains
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              One Platform. Every Chain
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...companyLogos, ...companyLogos];

  return (
    <section className="py-12 bg-white dark:bg-slate-800 border-t border-slate-200/50 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            List Tokens Across All Major Blockchains
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            One Platform. Every Chain
          </p>
        </div>

        {companyLogos.length > 0 ? (
          <div className="relative overflow-hidden">
            {/* Gradient overlays for smooth fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-slate-800 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-slate-800 to-transparent z-10"></div>
            
            {/* Moving logos container */}
            <div className="flex animate-scroll">
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.id}-${index}`}
                  className="flex-shrink-0 mx-8 group"
                >
                  <div className="w-32 h-16 bg-slate-100/80 dark:bg-slate-700/50 rounded-lg border border-slate-200/50 dark:border-white/10 flex items-center justify-center p-3 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-600/50 transition-all duration-300 group-hover:scale-105">
                    <img
                      src={logo.logo_url}
                      alt={logo.alt_text || `${logo.company_name} logo`}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200&h=100';
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {logo.company_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400">
              No company logos available at the moment.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default CompanySection;