// src/components/Footer.jsx
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import Logo from "../../Components/Logo/Logo"; 

const Footer = () => {
  return (
    <footer className="bg-gray-900 rounded-2xl text-gray-300 py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and description */}
        <div>
          <Logo size={50} text="CityWatch" />
          <p className="mt-4 text-gray-400">
            CityWatch helps citizens report public infrastructure issues quickly
            and track their resolution efficiently. Improving city services, one
            report at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-white transition-colors">
                Home
              </a>
            </li>
            <li>
              <a
                href="/all-issues"
                className="hover:text-white transition-colors"
              >
                All Issues
              </a>
            </li>
            <li>
              <a
                href="/how-it-works"
                className="hover:text-white transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
          <p>Email: support@citywatch.com</p>
          <p>Phone: +880 123 456 789</p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.facebook.com/Arman.Mir.8583"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://www.instagram.com/arman_mir_8583/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/armanmirdev/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="https://github.com/ArmanMirDeV"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CityWatch. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
