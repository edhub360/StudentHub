import { Menu, Bell, Settings, User, LogOut } from "lucide-react";

interface HeaderProps {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  activeTab: string;
  onLogout: () => void;
}

export default function Header({
  sidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  onLogout,
}: HeaderProps) {
  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      onLogout();
    }
  };

  return (
    <header
      className={`bg-white shadow-sm border-b border-gray-100 transition-all duration-300 ${
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <div className={`flex-1 ${mobileMenuOpen ? "hidden" : "block"} lg:block`}>
          <h2 className="text-xl font-semibold text-gray-900 capitalize">
            {activeTab === "home"
              ? "Dashboard"
              : activeTab.replace(/([A-Z])/g, " $1").trim()}
          </h2>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>

          {/* Small Logout Button */}
          <button
            onClick={handleLogoutClick}
            title="Logout"
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center ml-2">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
