"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { Heart, Bell, User, Trash2, Type, Palette, Moon, Sun } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // Load settings from localStorage
  const [autoSubtitle, setAutoSubtitle] = useState(() => {
    const saved = localStorage.getItem("autoSubtitle");
    return saved ? JSON.parse(saved) : false;
  });
  
  const [subtitleLines, setSubtitleLines] = useState(() => {
    const saved = localStorage.getItem("subtitleLines");
    return saved ? parseInt(saved) : 3;
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("autoSubtitle", JSON.stringify(autoSubtitle));
  }, [autoSubtitle]);
  
  useEffect(() => {
    localStorage.setItem("subtitleLines", subtitleLines.toString());
  }, [subtitleLines]);
  
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  // Define cozy themes
  const themes = [
    { id: "main", name: "Warm Sunset", colors: ["bg-amber-500", "bg-orange-500", "bg-rose-300"] },
    { id: "sunset", name: "Cozy Sunset", colors: ["bg-orange-400", "bg-amber-300", "bg-yellow-200"] },
    { id: "ocean", name: "Ocean Breeze", colors: ["bg-blue-500", "bg-cyan-400", "bg-teal-300"] },
    { id: "forest", name: "Forest Green", colors: ["bg-green-700", "bg-emerald-500", "bg-lime-300"] },
    { id: "lavender", name: "Lavender Dream", colors: ["bg-purple-500", "bg-violet-400", "bg-fuchsia-300"] },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/15 p-2 rounded-full">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="space-y-5">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-primary/15 p-1.5 rounded-full">
                  <Palette className="h-4 w-4 text-primary" />
                </div>
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for comfortable night writing
                  </p>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {themes.map((t) => (
                    <div
                      key={t.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        theme === t.id
                          ? "ring-2 ring-primary border-primary"
                          : "border-border/50 hover:border-primary/30"
                      }`}
                      onClick={() => setTheme(t.id as any)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{t.name}</span>
                        <div className="flex gap-1">
                          {t.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className={`w-4 h-4 rounded-full ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-secondary/15 p-1.5 rounded-full">
                  <Type className="h-4 w-4 text-secondary" />
                </div>
                Formatting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto Subtitle</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically create subtitles after specified lines
                  </p>
                </div>
                <Switch 
                  checked={autoSubtitle} 
                  onCheckedChange={setAutoSubtitle} 
                />
              </div>
              
              {autoSubtitle && (
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="font-medium">Lines Before Subtitle</h3>
                    <p className="text-sm text-muted-foreground">
                      Number of lines before auto-creating subtitle
                    </p>
                  </div>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={subtitleLines}
                    onChange={(e) => setSubtitleLines(parseInt(e.target.value) || 3)}
                    className="w-20 text-right"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-secondary/15 p-1.5 rounded-full">
                  <Bell className="h-4 w-4 text-secondary" />
                </div>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Daily Reminder</h3>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to write in your diary daily
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mood Check-in</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders to track your mood
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-accent/15 p-1.5 rounded-full">
                  <User className="h-4 w-4 text-accent" />
                </div>
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" className="mt-1 rounded-lg" />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="mt-1 rounded-lg" />
              </div>
              
              <Button className="rounded-full px-5 bg-primary hover:bg-primary/90" onClick={handleSave}>Update Account</Button>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <div className="bg-destructive/15 p-1.5 rounded-full">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </div>
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" className="rounded-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;