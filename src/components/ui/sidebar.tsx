"use client";

import React from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Heart } from "lucide-react";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
}

interface SidebarProps {
  entries?: DiaryEntry[];
  onViewEntry?: (entry: DiaryEntry) => void;
}

export function Sidebar({ entries = [], onViewEntry }: SidebarProps) {
  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const dateStr = format(entry.date, "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(entry);
    return acc;
  }, {} as Record<string, DiaryEntry[]>);

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <ScrollArea className="h-full px-2 py-2">
      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground/70">
            <div className="bg-muted/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Heart className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm">No entries yet</p>
            <p className="text-xs mt-1">Create your first entry</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="space-y-2">
              <h3 className="text-xs font-medium px-2 py-1 text-muted-foreground uppercase tracking-wider">
                {format(new Date(date), "MMM d")}
              </h3>
              <div className="space-y-1">
                {groupedEntries[date].map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/40 cursor-pointer text-xs transition-colors"
                    onClick={() => onViewEntry && onViewEntry(entry)}
                  >
                    <FileText className="h-3 w-3 mt-0.5 text-muted-foreground/70 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {entry.content.substring(0, 25)}
                        {entry.content.length > 25 ? "..." : ""}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {format(entry.date, "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}