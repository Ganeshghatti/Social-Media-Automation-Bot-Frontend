'use client'
import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Twitter, Send, Check, X} from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('/api/send-email', { // Replace with your server endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSubmitted(true);
      setError('');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <section id="cta" className="bg-neutral-900 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate__animated animate__fadeIn">
            Contact <span className="text-accent">Us</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg animate__animated animate__fadeIn">
            Ready to enhance your customer experience with a chatbot? Get in touch with us today!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="animate__animated animate__fadeInLeft">
            <h3 className="text-2xl font-bold text-white mb-6">
              Get in <span className="text-accent">Touch</span>
            </h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-accent mr-4 mt-1" />
                <div>
                  <p className="text-white font-semibold">Email Us</p>
                  <a href="mailto:info@thesquirrel.site" className="text-gray-300 hover:text-accent transition duration-300 block">
                    info@thesquirrel.site
                  </a>
                  <a href="mailto:hello@ganeshghatti.in" className="text-gray-300 hover:text-accent transition duration-300 block">
                    hello@ganeshghatti.in
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-accent mr-4 mt-1" />
                <div>
                  <p className="text-white font-semibold">Call Us</p>
                  <a href="tel:+919449610077" className="text-gray-300 hover:text-accent transition duration-300">
                    +91 94496 10077
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/the-squirrel-site"
                  className="bg-neutral-700 p-2 rounded-full hover:bg-accent transition duration-300"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-white" />
                </a>
                <a
                  href="https://x.com/thesquirrel_org"
                  className="bg-neutral-700 p-2 rounded-full hover:bg-accent transition duration-300"
                  aria-label="Follow us on Twitter"
                >
                  <X className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-800 rounded-xl p-8 shadow-xl animate__animated animate__fadeInRight">
            <h3 className="text-2xl font-bold text-white mb-6">
              Send a <span className="text-accent">Message</span>
            </h3>
            {isSubmitted ? (
              <div className="text-center py-8">
                <Check className="h-12 w-12 text-accent mx-auto mb-4" />
                <p className="text-white text-lg">Thank you! We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-semibold mb-2">
                      Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2">
                      Email <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-white font-semibold mb-2">
                      Message <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent transition duration-300 h-32 resize-none"
                      placeholder="How can we assist you?"
                      required
                    ></textarea>
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-[#e05a00] hover:bg-[#f08c4a] text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    Send Message
                    <Send className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;