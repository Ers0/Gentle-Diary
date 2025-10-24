"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { DiaryEditor } from "@/components/ui/diary-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText } from "lucide-react";
import { format } from "date-fns";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
}

const Diary = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        // Convert date strings back to Date objects
        return parsedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
      } catch (e) {
        console.error("Failed to parse saved entries", e);
        return [];
      }
    }
    return [
      {
        id: "1",
        date: new Date(),
        content: "Today was a great day! I accomplished so much and felt really productive.",
        mood: 1
      },
      {
        id: "2",
        date: new Date(Date.now() - 86400000),
        content: "Feeling a bit overwhelmed with work today. Need to take some time for myself.",
        mood: 4
      }
    ];
  });
  
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Save entries to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (entry: DiaryEntry) => {
    if (entries.some(e => e.id === entry.id)) {
      // Update existing entry
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
    } else {
      // Add new entry
      setEntries([entry, ...entries]);
    }
    setCurrentEntry(entry);
  };

  const handleNewEntry = () => {
    setCurrentEntry({
      id: Date.now().toString(),
      date: new Date(),
      content: "",
      mood: null
    });
  };

  const handleViewEntry = (entry: DiaryEntry) => {
    setCurrentEntry(entry);
  };

  const handleBackToList = () => {
    setCurrentEntry(null);
  };

  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    format(entry.date, "MMMM d, yyyy").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">My Diary</h1>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search entries..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar entries={filteredEntries} onViewEntry={handleViewEntry} />
        </div>
        <div className="p-4 border-t">
          <Button className="w-full" onClick={handleNewEntry}>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {currentEntry 
              ? format(currentEntry.date, "MMMM d, yyyy") 
              : "Welcome to your Diary"}
          </h2>
          {currentEntry && (
            <Button variant="outline" onClick={handleBackToList}>
              Back to List
            </Button>
          )}
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {currentEntry ? (
            <DiaryEditor 
              entry={currentEntry} 
              onSave={handleSaveEntry} 
            />
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-4">Your Digital Diary</h3>
                <p className="text-muted-foreground mb-6">
                  Capture your thoughts, feelings, and memories in one place.
                </p>
                <Button size="lg" onClick={handleNewEntry}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Entry
                </Button>
              </div>
              
              {entries.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-4">Recent Entries</h3>
                  <div className="space-y-4">
                    {filteredEntries.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewEntry(entry)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{format(entry.date, "MMMM d, yyyy")}</h4>
                          <span className="text-sm text-muted-foreground">
                            {format(entry.date, "h:mm a")}
                          </span>
                        </div>
                        <p className="mt-2 text-muted-foreground line-clamp-2">
                          {entry.content}
                        </p>
                        {entry.mood && (
                          <div className="mt-2 flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Mood recorded
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Diary;