"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { Heart, Bell, User, Trash2, Type } from "lucide-react";

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

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("autoSubtitle", JSON.stringify(autoSubtitle));
  }, [autoSubtitle]);
  
  useEffect(() => {
    localStorage.setItem("subtitleLines", subtitleLines.toString());
  }, [subtitleLines]);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

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
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
                />
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