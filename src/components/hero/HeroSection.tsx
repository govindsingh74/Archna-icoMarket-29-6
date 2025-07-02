import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Rocket, Eye, Palette } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ICOListingModal from '../ICOListingModal';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

interface HeroImage {
  id: number;
  image_url: string;
  alt_text?: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Launch Your Token",
    subtitle: "The Future of Digital Assets",
    description: "Create, manage, and showcase your cryptocurrency tokens on our cutting-edge platform. Join thousands of innovators who trust our secure and scalable infrastructure."
  },
  {
    id: 2,
    title: "Discover New Opportunities",
    subtitle: "Explore Tomorrow's Tokens Today",
    description: "Browse through the latest token launches and discover emerging projects. Stay ahead of the curve with real-time updates and comprehensive project insights."
  },
  {
    id: 3,
    title: "NFT Marketplace",
    subtitle: "Explore Digital Collectibles",
    description: "Discover unique NFTs from talented creators worldwide. Browse, collect, and trade digital art in our comprehensive NFT marketplace."
  },
  {
    id: 4,
    title: "Join the Revolution",
    subtitle: "Build the Decentralized Future",
    description: "Be part of the blockchain revolution. Our platform provides the tools and visibility your token needs to succeed in the competitive digital marketplace."
  }
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const fetchHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setHeroImages(data || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentImage = heroImages[currentSlide] || heroImages[0];

  const handleActionClick = () => {
    const currentSlideData = heroSlides[currentSlide];
    if (currentSlideData.title === "NFT Marketplace") {
      window.location.href = '/nft-index';
    } else {
      setIsModalOpen(true);
    }
  };

  const getActionButton = () => {
    const currentSlideData = heroSlides[currentSlide];
    if (currentSlideData.title === "NFT Marketplace") {
      return {
        icon: Palette,
        text: "Explore NFTs",
        secondaryIcon: Eye,
        secondaryText: "Submit NFT",
        secondaryAction: () => window.location.href = '/submit-nft'
      };
    }
    return {
      icon: Rocket,
      text: "List New Project",
      secondaryIcon: Eye,
      secondaryText: "See All Projects",
      secondaryAction: () => window.location.href = '/ico'
    };
  };

  const actionButton = getActionButton();

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Slide Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-2 bg-blue-100/80 dark:bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-400/30">
                    <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                      {heroSlides[currentSlide].subtitle}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    {heroSlides[currentSlide].description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={handleActionClick}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <actionButton.icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>{actionButton.text}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                  
                  <button 
                    onClick={actionButton.secondaryAction}
                    className="group px-8 py-4 bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm text-slate-700 dark:text-white font-semibold rounded-xl border border-slate-200/50 dark:border-white/20 hover:bg-slate-200/80 dark:hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <actionButton.secondaryIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>{actionButton.secondaryText}</span>
                  </button>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm border border-slate-200/50 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-200/80 dark:hover:bg-white/20 transition-all duration-300 group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                
                <div className="flex gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-blue-500 scale-125'
                          : 'bg-slate-300 dark:bg-white/30 hover:bg-slate-400 dark:hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm border border-slate-200/50 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-200/80 dark:hover:bg-white/20 transition-all duration-300 group"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Right Image - Reduced by 20% */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-sm mx-auto">
                {/* Image Container - Reduced from max-w-lg to max-w-sm (20% reduction) */}
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 shadow-2xl">
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : currentImage ? (
                    <img
                      src={currentImage.image_url}
                      alt={currentImage.alt_text || `Hero image ${currentSlide + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Default hero image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/20 to-transparent"></div>
                </div>

                {/* Decorative Elements - Adjusted for smaller image */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-blue-300 to-purple-400 dark:from-blue-400 dark:to-purple-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-gradient-to-br from-emerald-300 to-blue-400 dark:from-emerald-400 dark:to-blue-500 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent"></div>
      </section>

      {/* ICO Listing Modal */}
      <ICOListingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default HeroSection;