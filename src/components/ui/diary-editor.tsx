"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Eye, SquarePen, Calendar, Smile } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/ui/rich-text-editor";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
  bookId?: string;
}

interface DiaryEditorProps {
  entry: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
  currentBookId?: string;
}

export function DiaryEditor({ entry, onSave, currentBookId }: DiaryEditorProps) {
  const [content, setContent] = useState(entry.content);
  const [isPreview, setIsPreview] = useState(false);
  const [mood, setMood] = useState<number | null>(entry.mood || null);
  const { toast } = useToast();

  const handleSave = () => {
    const updatedEntry: DiaryEntry = {
      ...entry,
      content,
      mood,
      bookId: currentBookId || entry.bookId,
      date: new Date() // Update timestamp on save
    };
    
    onSave(updatedEntry);
    
    toast({
      title: "Entry saved",
      description: "Your diary entry has been saved successfully.",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/15 p-2 rounded-full">
            <SquarePen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Diary Entry</h1>
            <p className="text-sm text-muted-foreground">
              {format(entry.date, "MMMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isPreview ? "outline" : "secondary"} 
            size="sm" 
            className="rounded-full"
            onClick={() => setIsPreview(false)}
          >
            <SquarePen className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant={!isPreview ? "outline" : "secondary"} 
            size="sm" 
            className="rounded-full"
            onClick={() => setIsPreview(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button className="rounded-full bg-primary hover:bg-primary/90" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-border/50 shadow-sm">
        <CardContent className="p-0 flex-1 flex flex-col">
          {isPreview ? (
            <div 
              className="flex-1 p-6 overflow-y-auto prose prose-stone dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content || "Your entry is empty. Start writing to see the preview." }}
            />
          ) : (
            <div className="flex-1 p-4">
              <RichTextEditor content={content} onChange={setContent} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mood:</span>
          {[1, 2, 3, 4, 5].map((moodValue) => (
            <Button
              key={moodValue}
              variant="outline"
              size="icon"
              className={`rounded-full w-8 h-8 ${
                mood === moodValue 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
              onClick={() => setMood(moodValue === mood ? null : moodValue)}
            >
              {moodValue === 1 && "😊"}
              {moodValue === 2 && "😃"}
              {moodValue === 3 && "😐"}
              {moodValue === 4 && "😢"}
              {moodValue === 5 && "😠"}
            </Button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {/* Character count would need to be implemented in the rich text editor */}
        </div>
      </div>
    </div>
  );
}