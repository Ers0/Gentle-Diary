"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MoodData {
  date: string;
  mood: number;
}

interface MoodChartProps {
  data: MoodData[];
}

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  // Get the most recent mood entry
  const currentMood = data.length > 0 ? data[data.length - 1].mood : null;
  
  // Mood spectrum labels
  const moodSpectrum = [
    { label: "Awful", value: 5, color: "bg-red-500" },
    { label: "Bad", value: 4, color: "bg-orange-500" },
    { label: "Okay", value: 3, color: "bg-yellow-500" },
    { label: "Good", value: 2, color: "bg-lime-500" },
    { label: "Great", value: 1, color: "bg-green-500" }
  ];
  
  // Calculate position for the indicator (0-100%)
  const calculatePosition = (mood: number) => {
    // Mood values: 1 (Happy/Great) to 5 (Angry/Awful)
    // We want 1 to be at 100% (right) and 5 at 0% (left)
    return ((5 - mood) / 4) * 100;
  };
  
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Current Mood Position</CardTitle>
      </CardHeader>
      <CardContent>
        {currentMood ? (
          <div className="space-y-6">
            <div className="relative">
              {/* Mood spectrum bar */}
              <div className="h-4 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-lime-500 to-green-500 rounded-full overflow-hidden">
                {/* Indicator */}
                <div 
                  className="absolute top-0 w-6 h-6 -mt-1 -ml-3 flex items-center justify-center"
                  style={{ left: `${calculatePosition(currentMood)}%` }}
                >
                  <div className="w-4 h-4 bg-white rounded-full border-2 border-primary shadow-lg"></div>
                </div>
              </div>
              
              {/* Labels */}
              <div className="flex justify-between mt-2">
                {moodSpectrum.map((item) => (
                  <div 
                    key={item.label} 
                    className="text-xs text-muted-foreground flex flex-col items-center"
                  >
                    <div className={`w-2 h-2 rounded-full mb-1 ${item.color}`}></div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Current mood display */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Your current mood is</p>
              <p className="text-xl font-bold">
                {moodSpectrum.find(m => m.value === currentMood)?.label || "Unknown"}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">No mood data yet. Start tracking your moods to see your position!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { MoodChart };