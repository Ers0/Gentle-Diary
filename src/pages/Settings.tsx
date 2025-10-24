"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { Heart, Bell, User, Trash2 } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

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
          <div className="bg-primary/10 p-2 rounded-full">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="space-y-5">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-full">
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
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Bell className="h-4 w-4 text-primary" />
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
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <User className="h-4 w-4 text-primary" />
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
              
              <Button className="rounded-full px-5" onClick={handleSave}>Update Account</Button>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <div className="bg-destructive/10 p-1.5 rounded-full">
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