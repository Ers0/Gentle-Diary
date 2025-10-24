"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh, Heart, Angry } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MoodTrackerProps {
  selectedMood: number | null;
  onMoodSelect: (moodId: number) => void;
}

const moodOptions = [
  { id: 1, icon: Smile, label: "Happy", color: "text-yellow-500" },
  { id: 2, icon: Heart, label: "Excited", color: "text-pink-500" },
  { id: 3, icon: Meh, label: "Neutral", color: "text-blue-500" },
  { id: 4, icon: Frown, label: "Sad", color: "text-indigo-500" },
  { id: 5, icon: Angry, label: "Angry", color: "text-red-500" },
];

export function MoodTracker({ selectedMood, onMoodSelect }: MoodTrackerProps) {
  const { toast } = useToast();

  const handleMoodSelect = (moodId: number) => {
    onMoodSelect(moodId);
    const moodLabel = moodOptions.find(m => m.id === moodId)?.label || "";
    toast({
      title: `${moodLabel} mood selected`,
      description: "",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">How are you feeling?</h3>
        <span className="text-xs text-muted-foreground">Optional</span>
      </div>
      <div className="flex justify-between">
        {moodOptions.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          
          return (
            <Button
              key={mood.id}
              variant="ghost"
              size="icon"
              className={`
                h-12 w-12 rounded-full transition-all
                ${isSelected 
                  ? `bg-primary/10 ${mood.color} scale-110` 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }
              `}
              onClick={() => handleMoodSelect(mood.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{mood.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}