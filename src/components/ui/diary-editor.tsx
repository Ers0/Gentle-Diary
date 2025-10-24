"use client";

import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Save, Calendar, Heart } from "lucide-react";
import { MoodTracker } from "@/components/ui/mood-tracker";
import { useToast } from "@/hooks/use-toast";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
  bookId?: string;
}

interface DiaryEditorProps {
  entry?: DiaryEntry;
  onSave?: (entry: DiaryEntry) => void;
  currentBookId?: string;
  onLeave?: () => void;
}

export function DiaryEditor({ entry, onSave, currentBookId, onLeave }: DiaryEditorProps) {
  const [content, setContent] = useState(entry?.content || "");
  const [selectedMood, setSelectedMood] = useState<number | null>(entry?.mood || null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = useRef(false);
  const hasAutoSaved = useRef(false);
  const autoSavedEntryRef = useRef<DiaryEntry | null>(null);

  // Auto-save when content changes (debounced)
  useEffect(() => {
    if (content !== (entry?.content || "") || selectedMood !== (entry?.mood || null)) {
      hasUnsavedChanges.current = true;
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout to save after 3 seconds of inactivity
      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 3000);
    }
    
    // Cleanup function
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, selectedMood]);

  // Save when component unmounts
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges.current && (content.trim() || entry?.content)) {
        handleAutoSave();
      }
      
      // Show toast when leaving if we auto-saved
      if (hasAutoSaved.current && onLeave) {
        toast({
          title: "Entry auto-saved",
          description: "",
        });
      }
    };
  }, [content, entry, onLeave]);

  const handleAutoSave = () => {
    if (!hasUnsavedChanges.current || (!content.trim() && !entry?.content)) return;
    
    if (onSave) {
      const entryToSave: DiaryEntry = {
        id: entry?.id || Date.now().toString(),
        date: entry?.date || new Date(),
        content,
        mood: selectedMood,
        bookId: currentBookId // Always use the current book ID
      };
      
      onSave(entryToSave);
      hasUnsavedChanges.current = false;
      hasAutoSaved.current = true;
      autoSavedEntryRef.current = entryToSave;
    }
  };

  const handleManualSave = () => {
    if (!content.trim() && !entry?.content) {
      toast({
        title: "Empty entry",
        description: "Please write something first",
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
        bookId: currentBookId // Always use the current book ID
      };
      
      onSave(entryToSave);
      hasUnsavedChanges.current = false;
      
      // Clear timeout since we're manually saving
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      toast({
        title: "Entry saved",
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
          <div className="space-y-4">
            <Textarea
              placeholder="Write your thoughts here..."
              className="min-h-[250px] text-base border-border/50 rounded-xl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                className="rounded-full px-5 bg-primary hover:bg-primary/90"
                onClick={handleManualSave}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}