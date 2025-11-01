"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { DiaryEditor } from "@/components/ui/diary-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { DiaryService, DiaryEntry } from "@/services/diaryService";
import { Search, Plus, FileText, Heart, FolderPlus, BookOpen, Palette, Cloud, Database } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

interface Book {
  id: string;
  name: string;
  createdAt: Date;
  color?: string;
}

// Predefined color options for books
const BOOK_COLORS = [
  { name: "Amber", value: "bg-amber-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Rose", value: "bg-rose-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Slate", value: "bg-slate-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Violet", value: "bg-violet-500" },
  { name: "Cyan", value: "bg-cyan-500" },
  { name: "Fuchsia", value: "bg-fuchsia-500" },
  { name: "Lime", value: "bg-lime-500" },
  { name: "Sky", value: "bg-sky-500" },
  { name: "Purple", value: "bg-purple-500" },
];

const Diary = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [books, setBooks] = useState<Book[]>(() => {
    const savedBooks = localStorage.getItem("diaryBooks");
    if (savedBooks) {
      try {
        const parsedBooks = JSON.parse(savedBooks);
        // Convert date strings back to Date objects
        return parsedBooks.map((book: any) => ({
          ...book,
          createdAt: new Date(book.createdAt)
        }));
      } catch (e) {
        console.error("Failed to parse saved books", e);
        return [];
      }
    }
    return [];
  });
  
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBookName, setNewBookName] = useState("");
  const [selectedColor, setSelectedColor] = useState(BOOK_COLORS[0].value);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load entries based on auth status
  useEffect(() => {
    if (loading) return;
    
    const loadEntries = async () => {
      if (user) {
        // Load from cloud
        try {
          const cloudEntries = await DiaryService.getCloudEntries();
          setEntries(cloudEntries);
        } catch (error) {
          console.error("Failed to load cloud entries:", error);
          toast({
            title: "Error",
            description: "Failed to load your diary entries. Showing local entries instead.",
            variant: "destructive"
          });
          setEntries(DiaryService.getLocalEntries());
        }
      } else {
        // Load from local storage
        setEntries(DiaryService.getLocalEntries());
      }
    };
    
    loadEntries();
  }, [user, loading, toast]);

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("diaryBooks", JSON.stringify(books));
  }, [books]);

  const handleSaveEntry = async (entry: DiaryEntry) => {
    try {
      if (user) {
        // Save to cloud
        const savedEntry = await DiaryService.saveCloudEntry(entry);
        if (entries.some(e => e.id === entry.id)) {
          // Update existing entry
          setEntries(entries.map(e => e.id === entry.id ? savedEntry : e));
        } else {
          // Add new entry
          setEntries([savedEntry, ...entries]);
        }
        setCurrentEntry(savedEntry);
      } else {
        // Save locally
        const savedEntry = DiaryService.saveLocalEntry(entry);
        if (entries.some(e => e.id === entry.id)) {
          // Update existing entry
          setEntries(entries.map(e => e.id === entry.id ? savedEntry : e));
        } else {
          // Add new entry
          setEntries([savedEntry, ...entries]);
        }
        setCurrentEntry(savedEntry);
      }
      
      toast({
        title: "Entry saved",
        description: user ? "Your entry has been saved to the cloud." : "Your entry has been saved locally."
      });
    } catch (error) {
      console.error("Failed to save entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNewEntry = () => {
    setCurrentEntry({
      id: Date.now().toString(),
      date: new Date(),
      content: "",
      mood: null,
      bookId: currentBook?.id
    });
  };

  const handleViewEntry = (entry: DiaryEntry) => {
    setCurrentEntry(entry);
  };

  const handleBackToList = () => {
    setCurrentEntry(null);
  };

  const handleCreateBook = () => {
    if (newBookName.trim()) {
      const newBook: Book = {
        id: Date.now().toString(),
        name: newBookName.trim(),
        createdAt: new Date(),
        color: selectedColor
      };
      setBooks([...books, newBook]);
      setNewBookName("");
      setSelectedColor(BOOK_COLORS[0].value);
      setIsAddingBook(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format(entry.date, "MMMM d, yyyy").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBook = currentBook ? entry.bookId === currentBook.id : true;
    
    return matchesSearch && matchesBook;
  });

  const bookEntries = books.map(book => ({
    ...book,
    entryCount: entries.filter(entry => entry.bookId === book.id).length
  }));

  const handleSyncToCloud = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    setIsSyncing(true);
    try {
      const success = await DiaryService.syncLocalToCloud();
      if (success) {
        toast({
          title: "Sync successful",
          description: "Your local entries have been synced to the cloud."
        });
        // Reload entries from cloud
        const cloudEntries = await DiaryService.getCloudEntries();
        setEntries(cloudEntries);
      }
    } catch (error) {
      console.error("Sync failed:", error);
      toast({
        title: "Sync failed",
        description: "Failed to sync your entries. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your diary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="bg-primary/15 p-2 rounded-full">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">My Diary</h1>
          </div>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search entries..." 
              className="pl-8 rounded-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <Button 
            variant="ghost" 
            className="w-full justify-between rounded-full text-left"
            onClick={() => setCurrentBook(null)}
          >
            <span>All Entries</span>
            <span className="bg-muted text-muted-foreground text-xs rounded-full px-2 py-0.5">
              {entries.length}
            </span>
          </Button>
        </div>
        <div className="px-3 py-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1">Books</h3>
          <div className="space-y-1">
            {bookEntries.map(book => (
              <Button
                key={book.id}
                variant={currentBook?.id === book.id ? "secondary" : "ghost"}
                className="w-full justify-between rounded-full text-left"
                onClick={() => setCurrentBook(book)}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${book.color || 'bg-amber-500'}`}></div>
                  <span className="truncate">{book.name}</span>
                </div>
                <span className="bg-muted text-muted-foreground text-xs rounded-full px-2 py-0.5">
                  {book.entryCount}
                </span>
              </Button>
            ))}
            {isAddingBook ? (
              <div className="px-3 py-2">
                <Input
                  placeholder="Book name"
                  value={newBookName}
                  onChange={(e) => setNewBookName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateBook()}
                  className="rounded-full text-sm mb-2"
                  autoFocus
                />
                
                {/* Color selection */}
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Color</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {BOOK_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={`w-6 h-6 rounded-full ${color.value} ${
                          selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedColor(color.value)}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="rounded-full flex-1" onClick={handleCreateBook}>
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="rounded-full flex-1"
                    onClick={() => {
                      setIsAddingBook(false);
                      setNewBookName("");
                      setSelectedColor(BOOK_COLORS[0].value);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start rounded-full text-left text-muted-foreground"
                onClick={() => setIsAddingBook(true)}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Book
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar entries={filteredEntries} onViewEntry={handleViewEntry} />
        </div>
        <div className="p-4 border-t border-border/50 space-y-2">
          {!user ? (
            <Button 
              className="w-full rounded-full" 
              variant="outline"
              onClick={handleSyncToCloud}
              disabled={isSyncing}
            >
              <Cloud className="mr-2 h-4 w-4" />
              {isSyncing ? "Syncing..." : "Login & Sync"}
            </Button>
          ) : (
            <div className="flex items-center text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/50">
              <Cloud className="mr-1 h-3 w-3" />
              <span>Saved to cloud</span>
            </div>
          )}
          <Button className="w-full rounded-full bg-primary hover:bg-primary/90" onClick={handleNewEntry}>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border/50 p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {currentBook ? (
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${currentBook.color || 'bg-amber-500'}`}></div>
                {currentBook.name}
              </div>
            ) : "All Entries"}
          </h2>
          {currentEntry && (
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleBackToList}>
              Back to List
            </Button>
          )}
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {currentEntry ? (
            <DiaryEditor 
              entry={currentEntry} 
              onSave={handleSaveEntry} 
              currentBookId={currentBook?.id}
            />
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center py-12">
                <div className="bg-primary/15 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">How are you feeling today?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Take a moment to reflect on your thoughts and emotions
                </p>
                <Button size="lg" className="rounded-full px-6 bg-primary hover:bg-primary/90" onClick={handleNewEntry}>
                  <Plus className="mr-2 h-4 w-4" />
                  Write an Entry
                </Button>
                
                {!user && (
                  <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex items-center justify-center mb-2">
                      <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Local Storage</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Your entries are saved locally on this device. 
                      <Link to="/login" className="text-primary hover:underline ml-1">Login</Link> to sync to the cloud.
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full mr-2 ${entries.length > 0 ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                      <span>{entries.length} entries saved locally</span>
                    </div>
                  </div>
                )}
              </div>
              
              {entries.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
                  <div className="space-y-3">
                    {filteredEntries.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="border border-border/50 rounded-xl p-4 hover:bg-muted/30 cursor-pointer transition-colors hover:border-primary/30"
                        onClick={() => handleViewEntry(entry)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{format(entry.date, "MMMM d")}</h4>
                          <span className="text-xs text-muted-foreground">
                            {format(entry.date, "h:mm a")}
                          </span>
                        </div>
                        <div className="mt-2 text-muted-foreground text-sm line-clamp-3">
                          <div className="prose prose-stone dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: entry.content }} />
                        </div>
                        {entry.mood && (
                          <div className="mt-2 flex items-center">
                            <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
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