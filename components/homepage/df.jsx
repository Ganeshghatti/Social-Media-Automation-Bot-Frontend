import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <a
              href="#"
              className="text-2xl font-bold text-white mb-4 inline-block font-sora"
            >
              <span className="text-[#e05a00]">Squirrel</span>
              <span className="text-[#f08c4a]">Pilot</span>
            </a>
            <p className="text-sm mb-6 font-dm-sans">
              Automate your social media with AI-powered tools designed for efficiency and growth.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-gray-300 hover:text-[#e05a00] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-gray-300 hover:text-[#e05a00] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-gray-300 hover:text-[#e05a00] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 font-sora">
              Quick Links
            </h4>
            <ul className="space-y-3 font-dm-sans">
              <li>
                <a
                  href="#features"
                  className="hover:text-[#f08c4a] transition-colors duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#platforms"
                  className="hover:text-[#f08c4a] transition-colors duration-300"
                >
                  Platforms
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-[#f08c4a] transition-colors duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-[#f08c4a] transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 font-sora">
              Contact Us
            </h4>
            <ul className="space-y-3 font-dm-sans">
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#f08c4a] mr-2" />
                <a href="mailto:support@squirrelpilot.com" className="hover:text-[#f08c4a] transition-colors duration-300">
                  support@squirrelpilot.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#f08c4a] mr-2" />
                <a href="tel:+1234567890" className="hover:text-[#f08c4a] transition-colors duration-300">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-[#f08c4a] mr-2" />
                <span>123 Automation Lane, Tech City</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 font-sora">
              Newsletter
            </h4>
            <p className="text-sm mb-4 font-dm-sans">
              Subscribe to get the latest updates and tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-full bg-neutral-800 text-gray-300 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#e05a00] font-dm-sans"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#e05a00] hover:bg-[#f08c4a] text-white rounded-full font-medium transition-colors duration-300 font-sora"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-sm">
          <p className="font-dm-sans">
            &copy; {new Date().getFullYear()} Squirrel Pilot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;