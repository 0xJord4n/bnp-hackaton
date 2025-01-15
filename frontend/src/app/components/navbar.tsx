import Link from "next/link";
import { Globe } from "lucide-react";

interface NavbarProps {
  onLogoClick: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900/70 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={onLogoClick} className="flex items-center group">
            <div className="relative">
              <Globe className="h-8 w-8 text-purple-500 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <span className="ml-2 text-white text-lg font-semibold group-hover:text-purple-300 transition-colors">
              CompanyLookup
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
