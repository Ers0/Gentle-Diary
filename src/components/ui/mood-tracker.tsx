"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MoodTrackerProps {
  selectedMood: number | null;
  onMoodSelect: (mood: number) => void;
}

const moodOptions = [
  { id: 1, label: "Happy", color: "bg-amber-500", emoji: "😊" },
  { id: 2, label: "Excited", color: "bg-orange-500", emoji: "😃" },
  { id: 3, label: "Neutral", color: "bg-slate-500", emoji: "😐" },
  { id: 4, label: "Sad", color: "bg-teal-500", emoji: "😢" },
  { id: 5, label: "Angry", color: "bg-rose-500", emoji: "😠" }
];

export function MoodTracker({ selectedMood, onMoodSelect }: MoodTrackerProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {moodOptions.map((mood) => (
        <button
          key={mood.id}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
            selectedMood === mood.id
              ? "border-primary ring-2 ring-primary/20"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => onMoodSelect(mood.id)}
        >
          <div className={`text-2xl mb-2 ${mood.color} w-12 h-12 rounded-full flex items-center justify-center`}>
            {mood.emoji}
          </div>
          <span className="text-sm font-medium">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}