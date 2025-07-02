import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "David Kim",
      role: "Founder, CryptoVault",
      company: "CryptoVault",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 5,
      text: "TokenLaunch transformed our project launch. Their team's expertise in marketing and community building helped us raise $2.5M in our ICO. The platform's user-friendly interface and comprehensive support made the entire process seamless.",
      results: {
        raised: "$2.5M",
        growth: "400%",
        timeline: "3 months"
      }
    },
    {
      name: "Sarah Martinez",
      role: "CEO, DeFiNext",
      company: "DeFiNext",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 5,
      text: "The team at TokenLaunch went above and beyond our expectations. Their strategic guidance and marketing expertise helped us achieve our funding goals 2 weeks ahead of schedule. Highly recommended for any serious blockchain project.",
      results: {
        raised: "$5.2M",
        growth: "650%",
        timeline: "6 weeks"
      }
    },
    {
      name: "Michael Chen",
      role: "CTO, BlockchainPay",
      company: "BlockchainPay",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 5,
      text: "Working with TokenLaunch was a game-changer for our project. Their technical expertise and regulatory guidance ensured our token launch was compliant and successful. The ROI on their services was incredible.",
      results: {
        raised: "$1.8M",
        growth: "300%",
        timeline: "2 months"
      }
    },
    {
      name: "Emily Rodriguez",
      role: "Founder, NFTMarket",
      company: "NFTMarket",
      image: "https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 5,
      text: "TokenLaunch's comprehensive approach to token launches is unmatched. From initial consultation to post-launch support, they were with us every step of the way. Our community grew from 0 to 50K members in just 2 months.",
      results: {
        raised: "$3.7M",
        growth: "500%",
        timeline: "8 weeks"
      }
    },
    {
      name: "James Wilson",
      role: "CEO, GameFi Pro",
      company: "GameFi Pro",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 5,
      text: "The marketing strategies provided by TokenLaunch were exceptional. They helped us reach our target audience effectively and build a strong community. Our token sale was oversubscribed by 300%.",
      results: {
        raised: "$4.1M",
        growth: "750%",
        timeline: "10 weeks"
      }
    }
  ];

  const stats = [
    { value: "500+", label: "Successful Projects" },
    { value: "$50M+", label: "Total Funds Raised" },
    { value: "98%", label: "Success Rate" },
    { value: "4.9/5", label: "Average Rating" }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentReview = testimonials[currentTestimonial];

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what successful project founders 
            have to say about their experience with TokenLaunch.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="relative bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 mb-12">
          {/* Quote Icon */}
          <div className="absolute top-6 left-6">
            <Quote className="w-12 h-12 text-blue-500/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Testimonial Content */}
            <div className="lg:col-span-2">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(currentReview.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Text */}
              <blockquote className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                "{currentReview.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-600">
                  <img
                    src={currentReview.image}
                    alt={currentReview.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">
                    {currentReview.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    {currentReview.role}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 text-sm">
                    {currentReview.company}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Results Achieved
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Funds Raised</span>
                  <span className="font-bold text-green-600">{currentReview.results.raised}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Community Growth</span>
                  <span className="font-bold text-blue-600">{currentReview.results.growth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Timeline</span>
                  <span className="font-bold text-purple-600">{currentReview.results.timeline}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 bg-white dark:bg-slate-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-blue-500 scale-125'
                      : 'bg-slate-300 dark:bg-slate-500 hover:bg-slate-400 dark:hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 bg-white dark:bg-slate-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                "{testimonial.text.substring(0, 120)}..."
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-600">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-xs">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Ready to Join Our Success Stories?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Let us help you achieve similar results. Start your token launch journey today 
            and become our next success story.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto">
            <TrendingUp className="w-5 h-5" />
            <span>Start Your Success Story</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;