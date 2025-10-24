"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Smile, 
  Home,
  Settings
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Diary", path: "/diary", icon: BookOpen },
    { name: "Mood", path: "/mood", icon: Smile },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MyDiary</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    asChild
                    className={cn("justify-start", isActive && "bg-muted")}
                  >
                    <Link to={item.path}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;