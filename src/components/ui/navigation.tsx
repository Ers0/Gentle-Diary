import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Smile, Settings, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Diary", href: "/diary", icon: BookOpen },
  { name: "Mood", href: "/mood", icon: Smile },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Navigation() {
  const { theme } = useTheme();
  const location = useLocation();

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 rounded-full">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Gentle Diary</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon 
                    className={cn(
                      "h-4 w-4 mr-2",
                      item.name === "Home" && "text-blue-500",
                      item.name === "Diary" && "text-emerald-500",
                      item.name === "Mood" && "text-amber-500",
                      item.name === "Settings" && "text-violet-500"
                    )} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}