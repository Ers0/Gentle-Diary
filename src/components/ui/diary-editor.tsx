"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Save, Calendar } from "lucide-react";
import { MoodTracker } from "@/components/ui/mood-tracker";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
}

interface DiaryEditorProps {
  entry?: DiaryEntry;
  onSave?: (entry: DiaryEntry) => void;
}

export function DiaryEditor({ entry, onSave }: DiaryEditorProps) {
  const [content, setContent] = useState(entry?.content || "");
  const [selectedMood, setSelectedMood] = useState<number | null>(entry?.mood || null);

  const handleSave = () => {
    if (onSave) {
      onSave({
        id: entry?.id || Date.now().toString(),
        date: entry?.date || new Date(),
        content,
        mood: selectedMood,
      });
    }
  };

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            {entry ? format(entry.date, "MMMM d, yyyy") : "New Entry"}
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{entry ? format(entry.date, "h:mm a") : format(new Date(), "h:mm a")}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <MoodTracker 
              selectedMood={selectedMood} 
              onMoodSelect={handleMoodSelect} 
            />
          </div>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your thoughts here..."
              className="min-h-[300px] text-lg"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}