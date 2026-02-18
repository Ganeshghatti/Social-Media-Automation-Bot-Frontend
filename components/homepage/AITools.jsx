'use client'
import { useState } from 'react';
import {
  Sparkles,
  PenTool,
  Image as ImageIcon,
  Clock,
  CheckCircle,
} from 'lucide-react';

const AiTools = () => {
  const [activeTab, setActiveTab] = useState('content');

  const tabs = [
    { id: 'content', label: 'Content Generator', icon: <PenTool className="h-5 w-5" /> },
    { id: 'image', label: 'Image Creator', icon: <ImageIcon className="h-5 w-5" /> },
    { id: 'scheduler', label: 'Smart Scheduler', icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <section id="ai-tools" className="py-20 bg-gray-50 dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
              <span className="uppercase text-[#f08c4a] text-sm font-bold tracking-wider font-sora">
                AI-Powered Tools
              </span>
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-sora">
            Supercharge Your Workflow with AI
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-dm-sans">
            Leverage cutting-edge AI technology to create, enhance, and schedule your social media content effortlessly.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-col sm:flex-row bg-white dark:bg-neutral-700 rounded-full shadow-md p-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium font-sora transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#e05a00] text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-600'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 gap-12 items-center">
          {/* Content Generator */}
          {activeTab === 'content' && (
            <>
              <div className="relative">
                <div className="bg-white dark:bg-neutral-700 rounded-xl shadow-xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-[#e05a00] rounded-lg flex items-center justify-center text-white">
                      <PenTool className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-sora">
                      AI Content Generator
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 font-dm-sans">
                    Instantly create compelling posts and captions tailored to your audience and platform.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-2" />
                      <span>Generate posts in seconds</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-2" />
                      <span>Customize tone and style</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-2" />
                      <span>Optimize for engagement</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#f08c4a] rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <div className="relative">
                {/* <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8M3x8YWklMjB0b29scyUyMGNvbnRlbnQlMjBnZW5lcmF0b3J8ZW58MHx8fHwxNzQzNDEwMjQ4fDA&ixlib=rb-4.0.3&q=80&w=1080?q=80"
                  alt="AI Content Generator in action"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/${e.target.width}x${e.target.height}`;
                  }}
                  width="5472"
                  height="3648"
                  className="w-full rounded-xl shadow-lg object-cover h-80"
                /> */}
              </div>
            </>
          )}

          {/* Image Creator */}
          {activeTab === 'image' && (
            <>
              <div className="relative">
                <div className="bg-white dark:bg-neutral-700 rounded-xl shadow-xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-[#f08c4a] rounded-lg flex items-center justify-center text-white">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-sora">
                      AI Image Creator
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 font-dm-sans">
                    Design stunning visuals with AI that perfectly complement your social media posts.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#f08c4a] mr-2" />
                      <span>Create custom graphics</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#f08c4a] mr-2" />
                      <span>Edit existing images</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#f08c4a] mr-2" />
                      <span>Multiple style options</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#34D399] rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <div className="relative">
                {/* <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad1a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8Mnx8YWklMjB0b29scyUyMGltYWdlJTIwY3JlYXRvcnxlbnwwfHx8fDE3NDM0MTAyNDh8MA&ixlib=rb-4.0.3&q=80&w=1080?q=80"
                  alt="AI Image Creator in action"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/${e.target.width}x${e.target.height}`;
                  }}
                  width="6720"
                  height="4480"
                  className="w-full rounded-xl shadow-lg object-cover h-80"
                /> */}
              </div>
            </>
          )}

          {/* Smart Scheduler */}
          {activeTab === 'scheduler' && (
            <>
              <div className="relative">
                <div className="bg-white dark:bg-neutral-700 rounded-xl shadow-xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-[#34D399] rounded-lg flex items-center justify-center text-white">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-sora">
                      Smart Scheduler
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 font-dm-sans">
                    Let AI determine the best times to post based on your audience’s activity patterns.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#34D399] mr-2" />
                      <span>Analyze audience behavior</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#34D399] mr-2" />
                      <span>Optimize posting times</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#34D399] mr-2" />
                      <span>Boost reach and engagement</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#e05a00] rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <div className="relative">
                {/* <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8NHx8YWklMjB0b29scyUyMHNjaGVkdWxlcnxlbnwwfHx8fDE3NDM0MTAyNDh8MA&ixlib=rb-4.0.3&q=80&w=1080?q=80"
                  alt="Smart Scheduler in action"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/${e.target.width}x${e.target.height}`;
                  }}
                  width="5184"
                  height="3456"
                  className="w-full rounded-xl shadow-lg object-cover h-80"
                /> */}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AiTools;