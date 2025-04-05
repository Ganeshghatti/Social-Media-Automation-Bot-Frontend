import { CheckCircle, Plus } from 'lucide-react';

const Platforms = () => {
  return (
    <section id="platforms" className="py-20 bg-gray-50 dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
              <span className="uppercase text-[#f08c4a] text-sm font-bold tracking-wider font-sora">
                Supported Platforms
              </span>
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-sora">
            Amplify Your Social Presence
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-dm-sans">
            Manage multiple platforms from a single dashboard with optimized workflows for each network.
          </p>
        </div>

        {/* Platforms Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* LinkedIn Platform */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-xl h-72 relative bg-white dark:bg-neutral-700">
              <div className="absolute inset-0 opacity-20">
                {/* <img
                  src="https://images.unsplash.com/photo-1484981138541-3d074aa97716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8Mnx8cGxhdGZvcm1zJTIwcHJvZmVzc2lvbmFsfGVufDB8MHx8fDE3NDM0MDk2MDZ8MA&ixlib=rb-4.0.3&q=80&w=1080?q=80"
                  alt="Professional using social media tools"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/${e.target.width}x${e.target.height}`;
                  }}
                  width="5760"
                  height="3840"
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-white dark:from-neutral-700 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-sora">
                    LinkedIn
                  </h3>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6">
                <div className="relative z-10">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-xs font-semibold mb-2 mr-2">
                      Professional
                    </span>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-xs font-semibold mb-2">
                      Business
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                    Elevate Your Professional Content
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 font-dm-sans">
                    Connect with professionals and grow your business network with optimized content formats for LinkedIn.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-1" />
                      Articles
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-1" />
                      Posts
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-1" />
                      Documents
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-1" />
                      Analytics
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-[#e05a00] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Plus className="h-6 w-6" />
            </div>
          </div>

          {/* Twitter/X Platform */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-xl h-72 relative bg-white dark:bg-neutral-700">
              <div className="absolute inset-0 opacity-20">
                {/* <img
                  src="https://images.unsplash.com/photo-1425421669292-0c3da3b8f529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8M3x8cGxhdGZvcm1zJTIwcHJvZmVzc2lvbmFsfGVufDB8MHx8fDE3NDM0MDk2MDZ8MA&ixlib=rb-4.0.3&q=80&w=1080?q=80"
                  alt="Professional in a business suit"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/${e.target.width}x${e.target.height}`;
                  }}
                  width="5048"
                  height="3370"
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-white dark:from-neutral-700 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-sora">
                    Twitter (X)
                  </h3>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6">
                <div className="relative z-10">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 rounded-full text-xs font-semibold mb-2 mr-2">
                      Real-time
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 rounded-full text-xs font-semibold mb-2">
                      Trending
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                    Engage in Real-Time Conversations
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 font-dm-sans">
                    Stay relevant with trending topics and instantly connect with your audience through scheduled posts.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-1" />
                      Tweets
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-1" />
                      Threads
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-1" />
                      Media
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-[#e05a00] mr-1" />
                      Polls
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-[#f08c4a] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Plus className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platforms;