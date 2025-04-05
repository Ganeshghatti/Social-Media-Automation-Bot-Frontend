import { CheckCircle, ChevronRight } from 'lucide-react';

const Workflow = () => {
  return (
    <section id="workflow" className="py-20 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
              <span className="uppercase text-[#f08c4a] text-sm font-bold tracking-wider font-sora">
                How It Works
              </span>
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-sora">
            Simplify Your Workflow
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-dm-sans">
            Follow these simple steps to automate your social media management and boost efficiency.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#e05a00] rounded-full flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Connect Your Accounts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Link your LinkedIn and Twitter accounts securely in just a few clicks.
              </p>
              <div className="flex items-center text-[#e05a00]">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">OAuth Authentication</span>
              </div>
            </div>
           
          </div>

          {/* Step 2 */}
          <div className="relative bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#f08c4a] rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Create Your Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Use AI tools to generate posts, images, and captions tailored to your brand.
              </p>
              <div className="flex items-center text-[#f08c4a]">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">AI-Powered Editor</span>
              </div>
            </div>
            
          </div>

          {/* Step 3 */}
          <div className="relative bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#34D399] rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Schedule Posts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Plan your content calendar with smart scheduling for optimal posting times.
              </p>
              <div className="flex items-center text-[#34D399]">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Smart Timing</span>
              </div>
            </div>
          
          </div>

          {/* Step 4 */}
          <div className="relative bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#e05a00] rounded-full flex items-center justify-center text-white font-bold text-sm">
              4
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-sora">
                Analyze & Optimize
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
                Track performance metrics and refine your strategy with actionable insights.
              </p>
              <div className="flex items-center text-[#e05a00]">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Real-Time Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#cta"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#e05a00] hover:bg-[#f08c4a] rounded-full text-white font-medium transition-colors duration-300 shadow-lg hover:shadow-xl font-sora"
          >
            Get Started Today
            <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Workflow;