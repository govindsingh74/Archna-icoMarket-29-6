import React from 'react';
import { Coins, Mail, Phone, MapPin, Twitter, MessageCircle, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg w-full h-full">
                <img
                  src="/logoF.png"
                  alt="TokenIndex Logo"
                  className="w-full h-full object-contain"
                />
              </div>              
            </div>
            <p className="text-slate-300 leading-relaxed">
              The premier platform for launching and discovering new cryptocurrency tokens. 
              Join thousands of innovators building the future of decentralized finance.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
              >
                <Twitter className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
              >
                <Github className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
              >
                <Linkedin className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/ico" className="text-slate-300 hover:text-white transition-colors">
                  All Projects
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-slate-300 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="/ico" className="text-slate-300 hover:text-white transition-colors">
                  Token Listing
                </a>
              </li>
              <li>
                <a href="/ico" className="text-slate-300 hover:text-white transition-colors">
                  ICO Launch
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-slate-300 hover:text-white transition-colors">
                  Marketing Services
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Smart Contract Audit
                </a>
              </li>
              <li>
                <a href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Consulting
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">support@tokenlaunch.io</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                <span className="text-slate-300">
                  123 Blockchain Street<br />
                  Crypto Valley, CV 12345<br />
                  United States
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Links Row */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="/contact" className="text-slate-400 hover:text-white transition-colors">
              Contact Us
            </a>
            <a href="/partner" className="text-slate-400 hover:text-white transition-colors">
              Partner
            </a>
            <a href="/influencer" className="text-slate-400 hover:text-white transition-colors">
              Influencer
            </a>
            <a href="/update-project" className="text-slate-400 hover:text-white transition-colors">
              Update Project Details
            </a>
            <a href="/show-ads" className="text-slate-400 hover:text-white transition-colors">
              Show Ads
            </a>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-400 text-sm">
              © {currentYear} TokenLaunch. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;