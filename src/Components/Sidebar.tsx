import { ChevronLeft, ChevronRightIcon } from "lucide-react";
import Logo from '../images/logo.edhub.png';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  navigation: NavigationItem[];
}

export default function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  setActiveTab,
  navigation,
}: SidebarProps) {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 transition-all duration-300 z-40 ${
        sidebarCollapsed ? "w-16" : "w-64"
      } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
        
    {/* Logo Section */}
    <div className="p-4 border-b border-gray-200">
    <div className="flex items-center gap-3">
        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
        {/* Custom Logo */}
        <img
            src={Logo} // adjust path
            alt="Logo"
            className="w-16 h-16 object-contain"
        />
        </div>
        {!sidebarCollapsed && (
        <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">Edhub360</h1>
            <p className="text-xs text-gray-500 truncate">
            Education without limits.
            </p>
        </div>
        )}
    </div>
    </div>


      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                }`} 
                title={sidebarCollapsed ? item.label : undefined}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-gray-200 hidden lg:block">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
