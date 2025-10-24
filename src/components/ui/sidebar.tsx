"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Calendar, 
  Smile, 
  Settings,
  Search,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 border-r bg-muted/30", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Diary
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Smile className="mr-2 h-4 w-4" />
              Mood Tracker
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-4 mb-2">
            <h2 className="text-lg font-semibold tracking-tight">Entries</h2>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Today's Entry
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Yesterday
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Last Week
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}