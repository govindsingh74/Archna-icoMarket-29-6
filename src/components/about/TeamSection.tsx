import React from 'react';
import { Users, MessageCircle, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: "Daniel Reich",
      role: "CEO & Founder",
      image: "https://wxyzgmayoanzetyuzwvi.supabase.co/storage/v1/object/sign/avatar/image.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOWNiMTcwYy04MTc5LTQ0NjgtOTFmNS1iMDVhMTZiM2M3YzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdmF0YXIvaW1hZ2UuanBnIiwiaWF0IjoxNzUxNDc3MDI0LCJleHAiOjE3ODMwMTMwMjR9.MuHvlkAF0daOg9qtTFV_PQKlmJzr08veC3auGY9BhF4",
      bio: "Crypto marketing strategist with 5 years in Web3 and fintech. Worked on token launches, NFT drops, and DeFi growth campaigns. Known for bridging the gap between tech and community.",
      expertise: ["Blockchain Strategy", "Financial Markets", "Business Development"]
    },
    {
      name: "Kati Chwist",
      role: "CTO",
      image: "https://wxyzgmayoanzetyuzwvi.supabase.co/storage/v1/object/sign/avatar/image%20(1).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOWNiMTcwYy04MTc5LTQ0NjgtOTFmNS1iMDVhMTZiM2M3YzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdmF0YXIvaW1hZ2UgKDEpLmpwZyIsImlhdCI6MTc1MTQ3NzA0NSwiZXhwIjoxNzgzMDEzMDQ1fQ.LP6-qUMOMEdG22bCw5VxJv7NDhHk4iS0l69qgCsTF7M",
      bio: "Ex-Google engineer specializing in distributed systems and smart contract security. PhD in Computer Science.",
      expertise: ["Smart Contracts", "Security Audits", "System Architecture"]
    },
    {
      name: "Mark Libscher",
      role: "Head of Marketing",
      image: "https://wxyzgmayoanzetyuzwvi.supabase.co/storage/v1/object/sign/avatar/image%20(3).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOWNiMTcwYy04MTc5LTQ0NjgtOTFmNS1iMDVhMTZiM2M3YzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdmF0YXIvaW1hZ2UgKDMpLmpwZyIsImlhdCI6MTc1MTQ3NzA2MiwiZXhwIjoxNzgzMDEzMDYyfQ.DRNvTTRJ0_e5PzlvkPrX0Bw4baqATrWWHV1cdg_quMQ",
      bio: "Marketing veteran with successful campaigns for 100+ crypto projects. Expert in community building and growth.",
      expertise: ["Digital Marketing", "Community Growth", "Brand Strategy"]
    },
    {
      name: "Melinda Szolgyemi",
      role: "Legal & Compliance",
      image: "https://wxyzgmayoanzetyuzwvi.supabase.co/storage/v1/object/sign/avatar/image%20(2).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOWNiMTcwYy04MTc5LTQ0NjgtOTFmNS1iMDVhMTZiM2M3YzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdmF0YXIvaW1hZ2UgKDIpLmpwZyIsImlhdCI6MTc1MTQ3NzEyMSwiZXhwIjoxNzgzMDEzMTIxfQ.fukNeFTPWorFilPpXPgCPLVVMKo1eSuD646ZVlN3C8E",
      bio: "Crypto law specialist with experience in regulatory compliance across multiple jurisdictions.",
      expertise: ["Regulatory Compliance", "Legal Framework", "Risk Management"]
    }
  ];

  const supportFeatures = [
    {
      icon: MessageCircle,
      title: "24/7 Live Chat",
      description: "Instant support through our live chat system",
      availability: "Always Available"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Direct phone line for urgent matters",
      availability: "Business Hours"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed support via email",
      availability: "< 2 Hour Response"
    },
    {
      icon: Users,
      title: "Dedicated Manager",
      description: "Personal account manager for premium clients",
      availability: "Premium Plans"
    }
  ];

  const helpServices = [
    "Project consultation and strategy",
    "Technical integration support",
    "Marketing campaign planning",
    "Regulatory compliance guidance",
    "Community building assistance",
    "Investor relations support",
    "Post-launch optimization",
    "Crisis management support"
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Our Team is Ready to Help
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Meet the experts behind TokenLaunch. Our experienced team is dedicated to ensuring 
            your project's success from launch to long-term growth.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
            >
              {/* Photo */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                {member.role}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                {member.bio}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-1 justify-center">
                {member.expertise.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-8">
            How We Support You
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center group hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                  {feature.description}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>{feature.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Services List */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              What We Help You With
            </h3>
            <div className="space-y-4">
              {helpServices.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
              Need Help Getting Started?
            </h4>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Our team is here to guide you through every step of your token launch journey. 
              From initial consultation to post-launch support, we've got you covered.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">Live Chat</div>
                  <div className="text-slate-600 dark:text-slate-300 text-sm">Available 24/7</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">Connect with Contact Us</div>
                  <div className="text-slate-600 dark:text-slate-300 text-sm">Response within 2 hours</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">+1 (000) 123-4567</div>
                  <div className="text-slate-600 dark:text-slate-300 text-sm">Mon-Fri 9AM-6PM EST</div>
                </div>
              </div>
            </div>
            
            <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;