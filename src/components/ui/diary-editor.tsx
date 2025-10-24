"use client";

import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Save, Calendar, Heart, BookOpen } from "lucide-react";
import { MoodTracker } from "@/components/ui/mood-tracker";
import { useToast } from "@/hooks/use-toast";

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

interface DiaryEditorProps {
  entry?: DiaryEntry;
  onSave?: (entry: DiaryEntry) => void;
}

export function DiaryEditor({ entry, onSave }: DiaryEditorProps) {
  const [content, setContent] = useState(entry?.content || "");
  const [selectedMood, setSelectedMood] = useState<number | null>(entry?.mood || null);
  const [selectedBookId, setSelectedBookId] = useState<string | undefined>(entry?.bookId);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = useRef(false);

  // Load books from localStorage
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

  // Auto-save when content changes (debounced)
  useEffect(() => {
    if (content !== (entry?.content || "") || selectedMood !== (entry?.mood || null) || selectedBookId !== entry?.bookId) {
      hasUnsavedChanges.current = true;
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout to save after 10 seconds of inactivity
      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 10000);
    }
    
    // Cleanup function
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, selectedMood, selectedBookId]);

  // Save when component unmounts
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges.current && (content.trim() || entry?.content)) {
        handleAutoSave();
      }
    };
  }, []);

  const handleAutoSave = () => {
    if (!hasUnsavedChanges.current || (!content.trim() && !entry?.content)) return;
    
    if (onSave) {
      const entryToSave: DiaryEntry = {
        id: entry?.id || Date.now().toString(),
        date: entry?.date || new Date(),
        content,
        mood: selectedMood,
        bookId: selectedBookId
      };
      
      onSave(entryToSave);
      hasUnsavedChanges.current = false;
      
      toast({
        title: "Saved",
        description: "",
      });
    }
  };

  const handleManualSave = () => {
    if (!content.trim() && !entry?.content) {
      toast({
        title: "Empty Entry",
        description: "Please write something",
        variant: "destructive",
      });
      return;
    }

    if (onSave) {
      setIsSaving(true);
      
      const entryToSave: DiaryEntry = {
        id: entry?.id || Date.now().toString(),
        date: entry?.date || new Date(),
        content,
        mood: selectedMood,
        bookId: selectedBookId
      };
      
      onSave(entryToSave);
      hasUnsavedChanges.current = false;
      
      // Clear timeout since we're manually saving
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      toast({
        title: "Saved",
        description: "",
      });
      
      setIsSaving(false);
    }
  };

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <Heart className="h-4 w-4 text-primary" />
            </div>
            {entry ? format(entry.date, "MMMM d, yyyy") : "New Entry"}
          </CardTitle>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{entry ? format(entry.date, "h:mm a") : format(new Date(), "h:mm a")}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="mb-5">
            <MoodTracker 
              selectedMood={selectedMood} 
              onMoodSelect={handleMoodSelect} 
            />
          </div>
          <div className="mb-5">
            <label className="text-sm font-medium mb-2 block">Organize in Book</label>
            <Select value={selectedBookId || "none"} onValueChange={(value) => setSelectedBookId(value === "none" ? undefined : value)}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No book</SelectItem>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id} className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground inline" />
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your thoughts here..."
              className="min-h-[250px] text-base border-border/50 rounded-xl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                className="rounded-full px-5 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary"
                onClick={handleManualSave}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}