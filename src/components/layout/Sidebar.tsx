
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { 
  Calendar, 
  Image, 
  Mail, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  Home,
  LayoutDashboard
} from "lucide-react";

const sidebarLinks = [
  {
    title: "Dashboard",
    path: "/",
    icon: <LayoutDashboard size={20} />
  },
  {
    title: "Content Generator",
    path: "/content",
    icon: <MessageSquare size={20} />
  },
  {
    title: "Image Generator",
    path: "/images",
    icon: <Image size={20} />
  },
  {
    title: "Email Campaigns",
    path: "/email",
    icon: <Mail size={20} />
  },
  {
    title: "Content Calendar",
    path: "/calendar",
    icon: <Calendar size={20} />
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings size={20} />
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-allendale-black border-allendale-gold"
        >
          <Menu size={20} className="text-allendale-gold" />
        </Button>
      </div>

      <aside 
        className={`fixed top-0 left-0 h-screen z-40 
          transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full" : "translate-x-0"}
          lg:translate-x-0 
          ${collapsed ? "w-0" : "w-64"}
          bg-allendale-black text-white border-r border-allendale-gold/20`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-allendale-gold/20">
            <Logo className="my-2" />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="lg:hidden text-allendale-gold hover:text-allendale-gold/80"
            >
              <X size={20} />
            </Button>
          </div>
          
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="px-3 space-y-1.5">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                    ${location.pathname === link.path 
                      ? "bg-allendale-gold/20 text-allendale-gold" 
                      : "text-gray-300 hover:bg-allendale-gold/10 hover:text-allendale-gold"
                    }`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  <span className="text-sm font-medium">{link.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-allendale-gold/20">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-allendale-gold/20 flex items-center justify-center">
                <Home size={16} className="text-allendale-gold" />
              </div>
              <div>
                <p className="text-sm font-medium">Allendale Social</p>
                <p className="text-xs text-gray-400">Marketing Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
