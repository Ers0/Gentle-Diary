"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

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
  
  // Mood spectrum labels with emojis
  const moodSpectrum = [
    { label: "Awful", value: 5, color: "bg-red-500", emoji: "😢" },
    { label: "Bad", value: 4, color: "bg-orange-500", emoji: "😕" },
    { label: "Okay", value: 3, color: "bg-yellow-500", emoji: "😐" },
    { label: "Good", value: 2, color: "bg-lime-500", emoji: "🙂" },
    { label: "Great", value: 1, color: "bg-green-500", emoji: "😊" }
  ];
  
  // Calculate position for the indicator (0-100%)
  const calculatePosition = (mood: number) => {
    // Mood values: 1 (Happy/Great) to 5 (Angry/Awful)
    // We want 1 to be at 100% (right) and 5 at 0% (left)
    return ((5 - mood) / 4) * 100;
  };
  
  // Get current mood info
  const currentMoodInfo = currentMood 
    ? moodSpectrum.find(m => m.value === currentMood) 
    : null;
  
  return (
    <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Mood Position</CardTitle>
        <Heart className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        {currentMood ? (
          <div className="space-y-6">
            <div className="relative pt-4">
              {/* Mood spectrum bar with cute styling */}
              <div className="h-6 bg-gradient-to-r from-red-400 via-orange-300 via-yellow-200 via-lime-300 to-green-400 rounded-full overflow-hidden relative shadow-inner">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-300/20 via-yellow-200/20 via-lime-300/20 to-green-400/20"></div>
                
                {/* Indicator with cute styling */}
                <div 
                  className="absolute top-0 w-8 h-8 -mt-1 -ml-4 flex items-center justify-center transition-all duration-700 ease-out"
                  style={{ left: `${calculatePosition(currentMood)}%` }}
                >
                  <div className="w-6 h-6 bg-white rounded-full border-3 border-primary shadow-lg flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Labels with emojis */}
              <div className="flex justify-between mt-3">
                {moodSpectrum.map((item) => (
                  <div 
                    key={item.label} 
                    className="text-xs flex flex-col items-center transition-all duration-300"
                  >
                    <span className="text-lg mb-1">{item.emoji}</span>
                    <span className={`font-medium ${currentMoodInfo?.value === item.value ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Current mood display with cute styling */}
            <div className="text-center bg-card/50 rounded-xl p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">You're feeling</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">{currentMoodInfo?.emoji}</span>
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentMoodInfo?.label || "Unknown"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on your most recent mood entry
              </p>
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center bg-card/30 rounded-xl border border-dashed border-border/50">
            <Heart className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">
              No mood data yet.<br />
              Start tracking your moods to see your position!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { MoodChart };