import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { BookOpen, ShieldCheck, HelpCircle, TrendingUp } from 'lucide-react';

const HelpCenter = () => {
  const sections = [
    {
      title: 'Market Trends',
      icon: <TrendingUp className="text-blue-500" />,
      content: 'Keep track of real estate price changes, popular neighborhoods, and construction material demand in Rwanda.'
    },
    {
      title: 'Building Tips',
      icon: <BookOpen className="text-orange-500" />,
      content: 'Expert advice on selecting materials, managing construction costs, and choosing the right architects for your project.'
    },
    {
      title: 'Safety Guide',
      icon: <ShieldCheck className="text-green-500" />,
      content: 'Learn how to verify land documents, secure your payments, and ensure your construction follows local building codes.'
    },
    {
      title: 'Customer Support',
      icon: <HelpCircle className="text-purple-500" />,
      content: 'Need help with an order or booking? Contact our support team for immediate assistance with any issues.'
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-dark mb-4">Resources & Help Center</h1>
            <p className="text-gray-500 text-lg">Everything you need to build and find your dream home successfully.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                  {React.cloneElement(section.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-primary rounded-[2.5rem] p-10 text-center text-white shadow-xl shadow-primary/20">
            <h2 className="text-2xl font-black mb-4">Still have questions?</h2>
            <p className="mb-8 opacity-90">Our team is here to help you 24/7 with any construction or property needs.</p>
            <a href="mailto:support@tabiconst.com" className="bg-white text-primary px-10 py-4 rounded-xl font-black inline-block hover:scale-105 transition-transform">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpCenter;
