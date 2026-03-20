import { Link } from 'react-router-dom';

interface FooterProps {
  sidebarCollapsed: boolean;
}

export default function Footer({ sidebarCollapsed }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-white border-t border-gray-100 transition-all duration-300 ${
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      }`}
    >
      <div className="px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Copyright Text */}
          <p className="text-sm text-gray-600">
            © {currentYear} <span className="font-semibold text-gray-900">EdHub360</span>. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <a
              href="/privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/terms-of-service.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
