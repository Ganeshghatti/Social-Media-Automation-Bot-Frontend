'use client'
import { useState } from 'react';
import Logo from './logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-neutral-900 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
           <Logo/>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <ul className="flex space-x-8 font-sora">
              <li>
                <a
                  href="#"
                  className="text-gray-700 dark:text-gray-200 hover:text-[#e05a00] transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-700 dark:text-gray-200 hover:text-[#e05a00] transition-colors duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#platforms"
                  className="text-gray-700 dark:text-gray-200 hover:text-[#e05a00] transition-colors duration-300"
                >
                  Platforms
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-700 dark:text-gray-200 hover:text-[#e05a00] transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
            <a
              href="#cta"
              className="bg-[#e05a00] hover:bg-[#f08c4a] text-white font-medium py-2 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg font-sora"
            >
              Contact
            </a>
          </div>

          {/* Mobile Navigation Button */}
          <button
            type="button"
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="pt-4 pb-3 space-y-3 font-sora">
            <li>
              <a
                href="#"
                className="block px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="block px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors duration-300"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#platforms"
                className="block px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors duration-300"
              >
                Platforms
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="block px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors duration-300"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="block px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors duration-300"
              >
                FAQ
              </a>
            </li>
            <li className="pt-2">
              <a
                href="#cta"
                className="block w-full text-center bg-[#e05a00] hover:bg-[#f08c4a] text-white font-medium py-2 px-4 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;