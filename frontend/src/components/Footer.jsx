import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-bold mb-6 font-poppins">TabiConst</h3>
            <p className="text-gray-400 mb-8 max-w-xs">
              The leading marketplace for real estate and construction materials. Find your dream home or get the best deals on building materials.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="/listings" className="text-gray-400 hover:text-white transition-colors">Browse Listings</a></li>
              <li><a href="/listings?category=house" className="text-gray-400 hover:text-white transition-colors">Houses for Sale</a></li>
              <li><a href="/listings?category=land" className="text-gray-400 hover:text-white transition-colors">Land Listings</a></li>
              <li><a href="/listings?category=material" className="text-gray-400 hover:text-white transition-colors">Construction Materials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Market Trends</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Building Tips</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-gray-400">
                <MapPin size={20} className="flex-shrink-0 text-primary" />
                <span>123 Real Estate St, Construction Avenue, CA 90210</span>
              </li>
              <li className="flex gap-3 text-gray-400">
                <Phone size={20} className="flex-shrink-0 text-primary" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex gap-3 text-gray-400">
                <Mail size={20} className="flex-shrink-0 text-primary" />
                <span>support@tabiconst.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TabiConst Marketplace. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
