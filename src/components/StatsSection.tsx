import React, { useState, useEffect } from 'react';
import { Users, Rocket, Network, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalUsers: number;
  totalProjects: number;
  networkCount: number;
  experience: number;
}

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProjects: 0,
    networkCount: 0,
    experience: 2
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total users
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Fetch total projects
      const { count: projectCount, error: projectError } = await supabase
        .from('ico_listings')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_approved', true);

      if (projectError) throw projectError;

      // Fetch network count from company logos (as requested)
      const { count: networkCount, error: networkError } = await supabase
        .from('company_logos')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (networkError) throw networkError;

      setStats({
        totalUsers: userCount || 0,
        totalProjects: projectCount || 0,
        networkCount: networkCount || 0,
        experience: 2
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      suffix: '+',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Rocket,
      label: 'Total Projects',
      value: stats.totalProjects,
      suffix: '+',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Network,
      label: 'Networks',
      value: stats.networkCount,
      suffix: '+',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: Calendar,
      label: 'Years Experience',
      value: stats.experience,
      suffix: '',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Platform Statistics
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join thousands of users and projects in the fastest-growing crypto ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-white/10 group-hover:border-slate-300/50 dark:group-hover:border-white/20">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>

                {/* Value */}
                <div className="mb-2">
                  {loading ? (
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  ) : (
                    <h3 className="text-4xl font-bold text-slate-800 dark:text-white">
                      {stat.value.toLocaleString()}{stat.suffix}
                    </h3>
                  )}
                </div>

                {/* Label */}
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {stat.label}
                </p>

                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;