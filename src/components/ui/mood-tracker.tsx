"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Smile, 
  Heart, 
  Meh, 
  Frown, 
  Angry 
} from "lucide-react";

interface MoodOption {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const moodOptions: MoodOption[] = [
  { id: 1, name: "Happy", icon: <Smile className="h-6 w-6" />, color: "text-yellow-500", bgColor: "bg-yellow-500" },
  { id: 2, name: "Excited", icon: <Heart className="h-6 w-6" />, color: "text-pink-500", bgColor: "bg-pink-500" },
  { id: 3, name: "Neutral", icon: <Meh className="h-6 w-6" />, color: "text-gray-500", bgColor: "bg-gray-500" },
  { id: 4, name: "Sad", icon: <Frown className="h-6 w-6" />, color: "text-blue-500", bgColor: "bg-blue-500" },
  { id: 5, name: "Angry", icon: <Angry className="h-6 w-6" />, color: "text-red-500", bgColor: "bg-red-500" },
];

interface MoodTrackerProps {
  onMoodSelect?: (moodId: number) => void;
  selectedMood?: number | null;
}

export function MoodTracker({ onMoodSelect, selectedMood }: MoodTrackerProps) {
  const handleMoodSelect = (moodId: number) => {
    if (onMoodSelect) {
      onMoodSelect(moodId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? "default" : "outline"}
              className={`flex flex-col h-20 items-center justify-center gap-1 ${
                selectedMood === mood.id ? mood.bgColor : ""
              }`}
              onClick={() => handleMoodSelect(mood.id)}
            >
              <span className={selectedMood === mood.id ? "text-white" : mood.color}>
                {mood.icon}
              </span>
              <span className={`text-xs ${selectedMood === mood.id ? "text-white" : ""}`}>
                {mood.name}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}