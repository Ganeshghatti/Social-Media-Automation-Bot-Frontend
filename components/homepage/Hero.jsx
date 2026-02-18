import {
    ArrowRight,
    MessageSquare,
    Camera,
    Pencil,
    Sun,
    Sparkles,
    Clock,
  } from 'lucide-react';
  
  const Hero = () => {
    return (
      <section
        id="hero"
        className="relative bg-gradient-to-br from-neutral-800 to-neutral-900 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30">
          {/* <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8MXx8bWFpbiUyMHZpZXclMjBmZWF0dXJlZCUyMGltYWdlJTIwcHJvZmVzc2lvbmFsJTIwaGlnaCUyMHF1YWxpdHklMjBmZWF0dXJlZHxlbnwwfDB8fHwxNzQzMTU5NDUyfDA&ixlib=rb-4.0.3&q=80&w=1080?q=80"
            alt="Professional at work representing social media automation"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/${e.target.width}x${e.target.height}`;
            }}
            width="5066"
            height="3377"
            className="w-full h-full object-cover"
          /> */}
        </div>
  
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <div className="mx-auto lg:mx-0 max-w-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-1 w-10 bg-[#f08c4a]"></div>
                  <span className="uppercase text-[#f08c4a] tracking-wider text-sm font-bold font-sora">
                    Social Media Automation
                  </span>
                </div>
  
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-sora">
                  Automate Your Social Presence
                </h1>
  
                <p className="text-lg md:text-xl text-gray-300 mb-8 font-dm-sans">
                  Schedule, publish, and optimize your content across platforms
                  with AI-powered tools that save time and maximize engagement.
                </p>
  
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#cta"
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#e05a00] hover:bg-[#f08c4a] rounded-full text-white font-medium transition-colors duration-300 shadow-lg hover:shadow-xl font-sora"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white hover:border-[#f08c4a] hover:text-[#f08c4a] rounded-full text-white font-medium transition-colors duration-300 font-sora"
                  >
                    Learn More
                  </a>
                </div>
  
                <div className="mt-10 flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-800 text-xs font-bold">
                      JD
                    </div>
                    <div className="w-10 h-10 rounded-full bg-neutral-400 flex items-center justify-center text-neutral-800 text-xs font-bold">
                      SK
                    </div>
                    <div className="w-10 h-10 rounded-full bg-neutral-500 flex items-center justify-center text-white text-xs font-bold">
                      RB
                    </div>
                    <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center text-white text-xs font-bold">
                      +
                    </div>
                  </div>
                  <p className="ml-4 text-sm text-gray-300">
                    <span className="font-bold">1,000+</span> social media managers
                    trust Squirrel Pilot
                  </p>
                </div>
              </div>
            </div>
  
            <div className="w-full lg:w-1/2">
              <div className="relative mx-auto max-w-md lg:max-w-lg">
                <div className="bg-neutral-800/70 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-neutral-700">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Squirrel Pilot Dashboard
                    </div>
                  </div>
  
                  <div className="space-y-4">
                    <div className="bg-neutral-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-[#e05a00] rounded-full flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">New Post</span>
                        </div>
                        <div className="text-xs bg-[#34D399] text-neutral-900 py-1 px-3 rounded-full">
                          AI Powered
                        </div>
                      </div>
                      <div className="h-20 bg-neutral-600 rounded mb-3 flex items-center justify-center text-sm text-gray-300">
                        Your content will appear here...
                      </div>
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <button className="p-2 bg-neutral-600 rounded hover:bg-neutral-500 transition-colors">
                            <Camera className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-neutral-600 rounded hover:bg-neutral-500 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center border border-[#f08c4a] text-[#f08c4a]">
                            <Sun className="h-3 w-3" />
                          </div>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center border border-[#34D399] text-[#34D399]">
                            <Sparkles className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <div className="flex justify-between items-center bg-neutral-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-[#f08c4a]" />
                        <span>Schedule for later</span>
                      </div>
                      <div className="bg-neutral-600 rounded-full py-1 px-3 text-xs">
                        Today, 3:00 PM
                      </div>
                    </div>
  
                    <div className="bg-neutral-700 rounded-lg p-4">
                      <div className="flex space-x-3 mb-3">
                        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs">
                          Li
                        </div>
                        <div className="w-6 h-6 rounded bg-blue-400 flex items-center justify-center text-white text-xs">
                          X
                        </div>
                        <div className="w-6 h-6 rounded bg-pink-500 flex items-center justify-center text-white text-xs">
                          IG
                        </div>
                      </div>
                      <div className="text-sm">
                        Publish to multiple platforms with a single click
                      </div>
                    </div>
                  </div>
  
                  <div className="mt-6">
                    <button className="w-full py-3 bg-[#e05a00] hover:bg-[#f08c4a] rounded-lg font-medium transition-colors duration-300">
                      Publish Now
                    </button>
                  </div>
                </div>
  
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#f08c4a] rounded-full flex items-center justify-center text-neutral-900 font-bold text-sm animate-pulse">
                  <div className="text-center leading-tight">
                    <div>AI</div>
                    <div>Powered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-neutral-900 to-transparent"></div>
      </section>
    );
  };
  
  export default Hero;