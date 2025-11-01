import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, BookOpen, Smile, Settings, LogIn, LogOut } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary/15 p-1.5 rounded-full">
                <Heart className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">Your Gentle Diary</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/diary">
                <Button 
                  variant={isActive("/diary") ? "secondary" : "ghost"} 
                  size="sm"
                  className="rounded-full"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Diary
                </Button>
              </Link>
              
              <Link to="/mood">
                <Button 
                  variant={isActive("/mood") ? "secondary" : "ghost"} 
                  size="sm"
                  className="rounded-full"
                >
                  <Smile className="h-4 w-4 mr-2" />
                  Mood
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to="/settings">
              <Button 
                variant={isActive("/settings") ? "secondary" : "ghost"} 
                size="sm"
                className="rounded-full"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            
            {user ? (
              <Button 
                variant="ghost" 
                size="sm"
                className="rounded-full"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-full"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;