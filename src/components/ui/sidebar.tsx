"use client";

import React from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

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
    <ScrollArea className="h-full px-2">
      <div className="space-y-4 py-2">
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No entries yet</p>
            <p className="text-sm mt-2">Create your first entry to get started</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium px-2 py-1">
                {format(new Date(date), "MMMM d, yyyy")}
              </h3>
              <div className="space-y-1">
                {groupedEntries[date].map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-muted cursor-pointer text-sm"
                    onClick={() => onViewEntry && onViewEntry(entry)}
                  >
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {entry.content.substring(0, 30)}
                        {entry.content.length > 30 ? "..." : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
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