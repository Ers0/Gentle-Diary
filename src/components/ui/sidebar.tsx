"use client";

import React from "react";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
  bookId?: string;
}

interface SidebarProps {
  entries: DiaryEntry[];
  onViewEntry: (entry: DiaryEntry) => void;
}

export function Sidebar({ entries, onViewEntry }: SidebarProps) {
  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = format(entry.date, "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, DiaryEntry[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="px-3 py-2">
      <div className="space-y-4">
        {sortedDates.map(date => (
          <div key={date}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1">
              {format(new Date(date), "MMMM d, yyyy")}
            </h3>
            <div className="space-y-1">
              {groupedEntries[date].map(entry => (
                <button
                  key={entry.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                  onClick={() => onViewEntry(entry)}
                >
                  <p className="text-sm font-medium truncate">
                    {entry.content.substring(0, 50)}{entry.content.length > 50 ? '...' : ''}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {format(entry.date, "h:mm a")}
                    </span>
                    {entry.mood && (
                      <FileText className="h-3 w-3 ml-2 text-muted-foreground" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {sortedDates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No entries found</p>
          </div>
        )}
      </div>
    </div>
  );
}