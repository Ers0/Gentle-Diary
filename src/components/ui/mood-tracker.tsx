"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MoodTrackerProps {
  selectedMood: number | null;
  onMoodSelect: (mood: number) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ selectedMood, onMoodSelect }) => {
  // Mood options with distinct colors and styling
  const moodOptions = [
    { id: 1, label: "Happy", color: "bg-green-500", selectedColor: "bg-green-600", emoji: "😊", textColor: "text-green-700", ringColor: "ring-green-500" },
    { id: 2, label: "Excited", color: "bg-yellow-500", selectedColor: "bg-yellow-600", emoji: "😃", textColor: "text-yellow-700", ringColor: "ring-yellow-500" },
    { id: 3, label: "Neutral", color: "bg-gray-500", selectedColor: "bg-gray-600", emoji: "😐", textColor: "text-gray-700", ringColor: "ring-gray-500" },
    { id: 4, label: "Sad", color: "bg-blue-500", selectedColor: "bg-blue-600", emoji: "😢", textColor: "text-blue-700", ringColor: "ring-blue-500" },
    { id: 5, label: "Angry", color: "bg-red-500", selectedColor: "bg-red-600", emoji: "😠", textColor: "text-red-700", ringColor: "ring-red-500" }
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {moodOptions.map((mood) => (
        <Card
          key={mood.id}
          className={`
            cursor-pointer transition-all duration-200 hover:scale-105 border-0
            ${selectedMood === mood.id 
              ? `transform scale-110 ${mood.selectedColor} ring-4 ${mood.ringColor} ring-opacity-50` 
              : `${mood.color} hover:${mood.selectedColor}`}
          `}
          onClick={() => onMoodSelect(mood.id)}
        >
          <CardContent className="p-3 flex flex-col items-center justify-center">
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className={`
              text-xs font-medium text-center
              ${selectedMood === mood.id 
                ? "text-white" 
                : mood.textColor}
            `}>
              {mood.label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { MoodTracker };