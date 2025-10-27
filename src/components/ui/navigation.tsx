import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Smile, 
  Calendar, 
  Settings,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Sparkles },
    { path: "/diary", label: "Diary", icon: BookOpen },
    { path: "/mood", label: "Mood", icon: Smile },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                GentleDiary
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "rounded-full px-4 py-2 h-auto font-medium transition-all duration-300",
                    isActive 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg" 
                      : "text-foreground hover:text-primary"
                  )}
                  asChild
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">U</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;