import React from 'react';
import { Target, Eye, Heart, Users } from 'lucide-react';

const AboutUsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            About TokenLaunch
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We are the premier platform connecting innovative blockchain projects with forward-thinking investors. 
            Our mission is to democratize access to early-stage cryptocurrency investments while maintaining the highest standards of security and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20">
              <img
                src="https://wxyzgmayoanzetyuzwvi.supabase.co/storage/v1/object/sign/aboutus/ChatGPT%20Image%20Jul%202,%202025,%2009_40_45%20AM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOWNiMTcwYy04MTc5LTQ0NjgtOTFmNS1iMDVhMTZiM2M3YzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhYm91dHVzL0NoYXRHUFQgSW1hZ2UgSnVsIDIsIDIwMjUsIDA5XzQwXzQ1IEFNLnBuZyIsImlhdCI6MTc1MTQ2NzI3NiwiZXhwIjoxNzgzMDAzMjc2fQ.YXLLs0NTGKBpP0XZx3AGhop7eGmu7Xj6NV41SiXQL3A"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-20 blur-xl"></div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Our Story
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Founded in 2022 by a team of blockchain enthusiasts and financial experts, TokenLaunch emerged from the need for a trusted, 
                comprehensive platform where innovative projects could showcase their potential to a global audience of investors.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We've facilitated over $50M in successful token launches and continue to be the bridge between groundbreaking 
                blockchain technology and the investment community.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Innovation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Pioneering the future of decentralized finance</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Transparency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Complete visibility in all our processes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                  <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Trust</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Building lasting relationships with our community</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Community</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Fostering a global ecosystem of innovators</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;