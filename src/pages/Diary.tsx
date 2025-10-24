"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { DiaryEditor } from "@/components/ui/diary-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Heart, FolderPlus, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
  bookId?: string;
}

interface Book {
  id: string;
  name: string;
  createdAt: Date;
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

  // Save entries to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
  }, [entries]);

  // Save books to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("diaryBooks", JSON.stringify(books));
  }, [books]);

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
        createdAt: new Date()
      };
      setBooks([...books, newBook]);
      setNewBookName("");
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
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
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
        <div className="p-4 border-t border-border/50">
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
            {currentBook ? currentBook.name : "All Entries"}
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
                        <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
                          {entry.content}
                        </p>
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