import { Link, PenTool, Calendar, BarChart, ChevronRight } from 'lucide-react';

const HowSquirrelPilotWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
              <span className="uppercase text-[#f08c4a] text-sm font-bold tracking-wider font-sora">
                How Squirrel Pilot Works
              </span>
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-sora">
            Your Social Media, Automated
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-dm-sans">
            Discover how Squirrel Pilot uses AI to streamline your social media management in four simple steps.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#e05a00] rounded-full flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div className="mt-6 flex justify-center">
              <Link className="h-8 w-8 text-[#e05a00]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white text-center mt-4 font-sora">
              Connect Platforms
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center font-dm-sans">
              Link your LinkedIn and Twitter accounts securely with a single click.
            </p>
            
          </div>

          {/* Step 2 */}
          <div className="relative bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#f08c4a] rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div className="mt-6 flex justify-center">
              <PenTool className="h-8 w-8 text-[#f08c4a]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white text-center mt-4 font-sora">
              Generate Content
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center font-dm-sans">
              Use AI to create posts and visuals tailored to your brand’s voice.
            </p>
          
          </div>

          {/* Step 3 */}
          <div className="relative bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#34D399] rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div className="mt-6 flex justify-center">
              <Calendar className="h-8 w-8 text-[#34D399]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white text-center mt-4 font-sora">
              Schedule Smartly
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center font-dm-sans">
              AI schedules posts at peak times for maximum reach.
            </p>
           
          </div>

          {/* Step 4 */}
          <div className="relative bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#e05a00] rounded-full flex items-center justify-center text-white font-bold text-sm">
              4
            </div>
            <div className="mt-6 flex justify-center">
              <BarChart className="h-8 w-8 text-[#e05a00]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white text-center mt-4 font-sora">
              Track Performance
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center font-dm-sans">
              Analyze results and refine your strategy with AI insights.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#cta"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#e05a00] hover:bg-[#f08c4a] rounded-full text-white font-medium transition-colors duration-300 shadow-lg hover:shadow-xl font-sora"
          >
            Try Squirrel Pilot Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowSquirrelPilotWorks;