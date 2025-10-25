"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { DiaryEditor } from "@/components/ui/diary-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Heart, FolderPlus, BookOpen, Palette } from "lucide-react";
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
  color?: string;
}

// Predefined color options for books
const BOOK_COLORS = [
  { name: "Purple", value: "bg-purple-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Teal", value: "bg-teal-500" },
];

// Function to format markdown-like content for display
const formatContentForDisplay = (content: string) => {
  // Split content into lines
  const lines = content.split('\n');
  
  // Process lines to convert markdown-like syntax to HTML
  const processedLines = lines.map((line, index) => {
    // Handle titles (H1)
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      return `<h1 class="text-2xl font-bold mt-4 mb-2">${line.substring(2)}</h1>`;
    }
    
    // Handle subtitles (H2)
    if (line.startsWith('## ')) {
      return `<h2 class="text-xl font-semibold mt-3 mb-2 text-muted-foreground">${line.substring(3)}</h2>`;
    }
    
    // Handle horizontal rule
    if (line === '---') {
      return `<hr class="my-4 border-border" />`;
    }
    
    // Handle blockquotes
    if (line.startsWith('> ')) {
      return `<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-2">${line.substring(2)}</blockquote>`;
    }
    
    // Handle font sizes
    let processedLine = line;
    processedLine = processedLine.replace(/\{small\}(.*?)\{\/small\}/g, '<span class="text-xs">$1</span>');
    processedLine = processedLine.replace(/\{normal\}(.*?)\{\/normal\}/g, '<span class="text-sm">$1</span>');
    processedLine = processedLine.replace(/\{large\}(.*?)\{\/large\}/g, '<span class="text-lg">$1</span>');
    processedLine = processedLine.replace(/\{xlarge\}(.*?)\{\/xlarge\}/g, '<span class="text-xl">$1</span>');
    
    // Handle bold
    processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Handle italic
    processedLine = processedLine.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Handle underline
    processedLine = processedLine.replace(/__(.*?)__/g, '<u class="underline">$1</u>');
    
    // Handle bullet lists
    if (line.startsWith('- ')) {
      return `<li class="ml-4 list-disc">${processedLine.substring(2)}</li>`;
    }
    
    // Handle numbered lists
    if (/^\d+\./.test(line)) {
      return `<li class="ml-4 list-decimal">${processedLine.replace(/^\d+\.\s/, '')}</li>`;
    }
    
    // Handle paragraphs
    if (processedLine.trim() === '') {
      return '<br/>';
    }
    
    return `<p class="mb-2">${processedLine}</p>`;
  });
  
  // Group list items
  let inUnorderedList = false;
  let inOrderedList = false;
  const groupedLines = [];
  
  for (let i = 0; i < processedLines.length; i++) {
    const line = processedLines[i];
    
    if (line.includes('class="ml-4 list-disc"')) {
      if (!inUnorderedList) {
        groupedLines.push('<ul class="my-2">');
        inUnorderedList = true;
      }
      groupedLines.push(line);
    } else if (line.includes('class="ml-4 list-decimal"')) {
      if (!inOrderedList) {
        groupedLines.push('<ol class="my-2 list-decimal">');
        inOrderedList = true;
      }
      groupedLines.push(line);
    } else {
      if (inUnorderedList) {
        groupedLines.push('</ul>');
        inUnorderedList = false;
      }
      if (inOrderedList) {
        groupedLines.push('</ol>');
        inOrderedList = false;
      }
      groupedLines.push(line);
    }
  }
  
  // Close any open lists
  if (inUnorderedList) {
    groupedLines.push('</ul>');
  }
  if (inOrderedList) {
    groupedLines.push('</ol>');
  }
  
  // Join processed lines
  return groupedLines.join('');
};

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
        content: "# My First Entry\n\n## A beautiful day\n\nToday was a great day! I accomplished so much and felt really productive.\n\n- Finished my project\n- Went for a walk\n- Read a good book\n\n> This was truly an amazing day!",
        mood: 1
      },
      {
        id: "2",
        date: new Date(Date.now() - 86400000),
        content: "# Reflection\n\n## Feeling overwhelmed\n\nFeeling a bit overwhelmed with work today. Need to take some time for myself.\n\n1. Prioritize tasks\n2. Take breaks\n3. Ask for help\n\n---\n\nI should remember to be kinder to myself.",
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
  const [selectedColor, setSelectedColor] = useState(BOOK_COLORS[0].value);

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
                  <div className={`w-3 h-3 rounded-full mr-2 ${book.color || 'bg-purple-500'}`}></div>
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
            {currentBook ? (
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${currentBook.color || 'bg-purple-500'}`}></div>
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
                        <div 
                          className="mt-2 text-muted-foreground text-sm line-clamp-3"
                          dangerouslySetInnerHTML={{ 
                            __html: formatContentForDisplay(entry.content.split('\n').slice(0, 5).join('\n')) 
                          }}
                        />
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