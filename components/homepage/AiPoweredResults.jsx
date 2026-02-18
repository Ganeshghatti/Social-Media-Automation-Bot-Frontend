import { BarChart, Users, Clock } from 'lucide-react';

const AiPoweredResults = () => {
  return (
    <section id="ai-powered-results" className="py-20 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
              <span className="uppercase text-[#f08c4a] text-sm font-bold tracking-wider font-sora">
                AI-Powered Results
              </span>
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-sora">
            Proven Impact with AI Automation
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-dm-sans">
            See how Squirrel Pilot’s AI-driven tools deliver measurable growth and efficiency for your social media strategy.
          </p>
        </div>

        {/* Results Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Result 1 */}
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="w-16 h-16 bg-[#e05a00] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold text-[#e05a00] mb-2 font-sora">10+</h3>
            <p className="text-gray-600 dark:text-gray-300 font-dm-sans">
              Hours saved weekly through automated workflows.
            </p>
          </div>

          {/* Result 2 */}
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="w-16 h-16 bg-[#f08c4a] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <BarChart className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold text-[#f08c4a] mb-2 font-sora">3x</h3>
            <p className="text-gray-600 dark:text-gray-300 font-dm-sans">
              Increase in engagement with optimized posting.
            </p>
          </div>

          {/* Result 3 */}
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-neutral-700">
            <div className="w-16 h-16 bg-[#34D399] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold text-[#34D399] mb-2 font-sora">40%</h3>
            <p className="text-gray-600 dark:text-gray-300 font-dm-sans">
              Audience growth with consistent AI-driven content.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#cta"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#e05a00] hover:bg-[#f08c4a] rounded-full text-white font-medium transition-colors duration-300 shadow-lg hover:shadow-xl font-sora"
          >
            Start Achieving Results
          </a>
        </div>
      </div>
    </section>
  );
};

export default AiPoweredResults;