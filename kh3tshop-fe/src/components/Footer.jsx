import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="text-white"
      style={{
        background: "linear-gradient(to right, rgb(0, 0, 0), rgb(75, 85, 99))",
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-white text-black px-6 py-3 rounded-2xl inline-block w-fit">
              <span className="font-bold text-lg">
                KH<span className="text-red-500">3</span>T STUDIO
              </span>
            </div>
            <p className="text-gray-300 text-base font-bold leading-relaxed mx-2">
              Trusted fashion <br></br> brand with youthful <br></br> and
              dynamic style !
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-lg mb-2">Quick Links</h3>
            <a
              href="/"
              className="text-gray-300 hover:text-red-500 transition text-sm"
            >
              Home
            </a>
            <a
              href="/product"
              className="text-gray-300 hover:text-red-500 transition text-sm"
            >
              Products
            </a>
            <a
              href="/about"
              className="text-gray-300 hover:text-red-500 transition text-sm"
            >
              About Us
            </a>
            <a
              href="/policy"
              className="text-gray-300 hover:text-red-500 transition text-sm"
            >
              Policy
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg mb-2">Contact</h3>
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Phone size={18} className="text-red-500 flex-shrink-0" />
              <span>093 - 3462 - 6578</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Mail size={18} className="text-red-500 flex-shrink-0" />
              <span>contact@kh3tstudio.com</span>
            </div>
            <div className="flex items-start gap-3 text-gray-300 text-sm">
              <MapPin size={18} className="text-red-500 flex-shrink-0 mt-1" />
              <span>ABC Street, Go Vap, Ho Chi Minh City</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg mb-2">Follow Us</h3>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transform hover:scale-110 transition duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-full hover:from-purple-700 hover:to-pink-600 transform hover:scale-110 transition duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="bg-black p-3 rounded-full hover:bg-gray-900 transform hover:scale-110 transition duration-300 border border-gray-700"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-red-500 p-3 rounded-full hover:bg-red-600 transform hover:scale-110 transition duration-300"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-gray-300 text-xs mt-2">
              Get updates on new products and special offers
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-gray-400 text-2sm text-center">
              © 2025 KH3T Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
