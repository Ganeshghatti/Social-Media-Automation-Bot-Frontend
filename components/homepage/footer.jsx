import React from 'react';
import { Mail, Phone } from 'lucide-react';
import Logo from './logo';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12 border-t border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
        <Logo/>
            <p className="text-gray-400 mb-4">
              Empowering businesses with smart chatbot solutions since 2020.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/the-squirrel-site"
                className="bg-neutral-700 p-2 rounded-full  transition duration-300"
                aria-label="Follow us on LinkedIn"
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
                href="https://x.com/thesquirrel_org"
                className="bg-neutral-700 p-2 rounded-full transition duration-300"
                aria-label="Follow us on Twitter"
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
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "#hero", text: "Home" },
                { href: "#faq", text: "FAQ" },
                { href: "#cta", text: "Contact" }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 transition duration-300"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-1" />
                <div>
                  <a href="mailto:info@thesquirrel.site" className="text-gray-400  transition duration-300 block">
                    info@thesquirrel.site
                  </a>
                  <a href="mailto:hello@ganeshghatti.in" className="text-gray-400 transition duration-300 block">
                    hello@ganeshghatti.in
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-1" />
                <a href="tel:+919449610077" className="text-gray-400 transition duration-300">
                  +91 94496 10077
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} the squirrel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;