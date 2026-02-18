import {
    Calendar,
    Grid,
    Sparkles,
    Folder,
    BarChart,
    Clock,
    ChevronRight,
    Play,
    Users,
  } from 'lucide-react';
  
  const Features = () => {
    return (
      <section
        id="features"
        className="py-20 bg-white dark:bg-neutral-900"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="h-1 w-6 bg-[#f08c4a]"></div>
                <span className="uppercase text-[#f08c4a] text-sm font-bold tracking-wider font-sora">
                  Powerful Features
                </span>
                <div className="h-1 w-6 bg-[#f08c4a]"></div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-sora">
              Streamline Your Social Media Strategy
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-dm-sans">
              Automate, optimize, and scale your social media presence with our comprehensive toolkit.
            </p>
          </div>
  
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-[#e05a00]/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-[#e05a00]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Automated Publishing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Schedule posts across LinkedIn and Twitter with precise timing for maximum engagement.
              </p>
              <div className="pt-2 border-t border-gray-200 dark:border-neutral-700">
                <span className="inline-flex items-center text-sm font-medium text-[#e05a00]">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
  
            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-[#f08c4a]/10 rounded-lg flex items-center justify-center mb-4">
                <Grid className="h-8 w-8 text-[#f08c4a]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Cross-Platform Posting
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Create once, publish everywhere. Seamlessly share content across all your social networks.
              </p>
              <div className="pt-2 border-t border-gray-200 dark:border-neutral-700">
                <span className="inline-flex items-center text-sm font-medium text-[#f08c4a]">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
  
            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-[#34D399]/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-[#34D399]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                AI Content Creation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Generate engaging posts and eye-catching images with our advanced AI technology.
              </p>
              <div className="pt-2 border-t border-gray-200 dark:border-neutral-700">
                <span className="inline-flex items-center text-sm font-medium text-[#34D399]">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
  
            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-[#e05a00]/10 rounded-lg flex items-center justify-center mb-4">
                <Folder className="h-8 w-8 text-[#e05a00]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Content Library
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Save drafts and organize your content in our intuitive library for quick access anytime.
              </p>
              <div className="pt-2 border-t border-gray-200 dark:border-neutral-700">
                <span className="inline-flex items-center text-sm font-medium text-[#e05a00]">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
  
            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-[#f08c4a]/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-8 w-8 text-[#f08c4a]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Monitor performance with real-time analytics to optimize your social strategy.
              </p>
              <div className="pt-2 border-t border-gray-200 dark:border-neutral-700">
                <span className="inline-flex items-center text-sm font-medium text-[#f08c4a]">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
  
            {/* Feature 6 */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-[#34D399]/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-[#34D399]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Smart Scheduling
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Our AI determines the best time to post for maximum engagement based on your audience.
              </p>
              <div className="pt-2 border-t border-gray-200 dark:border-neutral-700">
                <span className="inline-flex items-center text-sm font-medium text-[#34D399]">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
  
          {/* Featured Showcase */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e05a00]/80 to-[#f08c4a]/80 opacity-90"></div>
            {/* <img
              src="https://images.unsplash.com/photo-1719399184280-89cfdecba587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8M3x8ZmVhdHVyZXMlMjBzaG93Y2FzZSUyMGRldGFpbGVkJTIwZGVtb25zdHJhdGl2ZXxlbnwwfDB8fHwxNzQzMTYwMTI3fDA&ixlib=rb-4.0.3&q=80&w=1080?q=80"
              alt="AI-powered social media management showcase"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/${e.target.width}x${e.target.height}`;
              }}
              width="11648"
              height="8736"
              className="w-full h-80 md:h-96 object-cover"
            /> */}
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="max-w-2xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-md font-sora">
                  Experience AI-Powered Social Media Management
                </h3>
                <p className="text-white mb-6 text-lg drop-shadow-md font-dm-sans">
                  Effortlessly create, schedule, and publish content that resonates with your audience.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#e05a00] font-medium rounded-full hover:bg-opacity-90 transition-colors shadow-md"
                >
                  <span>See It In Action</span>
                  <Play className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-white opacity-70">
              Photo by Neon Wang
            </div>
          </div>
  
          {/* Key Benefits */}
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white font-sora">
                Why Choose Squirrel Pilot
              </h3>
              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-dm-sans">
                Our platform delivers tangible results that help you grow your social media presence.
              </p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#e05a00] rounded-full flex items-center justify-center mb-4 text-white">
                  <Clock className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white font-sora">
                  Save 10+ Hours Weekly
                </h4>
                <p className="text-gray-600 dark:text-gray-300 font-dm-sans">
                  Automate repetitive tasks and focus on creating impactful content strategies.
                </p>
              </div>
  
              {/* Benefit 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#f08c4a] rounded-full flex items-center justify-center mb-4 text-white">
                  <BarChart className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white font-sora">
                  Increase Engagement 3x
                </h4>
                <p className="text-gray-600 dark:text-gray-300 font-dm-sans">
                  Optimize posting schedules and content types to maximize audience interaction.
                </p>
              </div>
  
              {/* Benefit 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#34D399] rounded-full flex items-center justify-center mb-4 text-white">
                  <Users className="h-8 w-8" /> {/* Assuming Users for audience growth */}
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white font-sora">
                  Grow Audience 40%
                </h4>
                <p className="text-gray-600 dark:text-gray-300 font-dm-sans">
                  Consistently deliver quality content that attracts and retains followers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;