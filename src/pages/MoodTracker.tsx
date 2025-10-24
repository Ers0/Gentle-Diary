"use client";

import React, { useState } from "react";
import { MoodTracker } from "@/components/ui/mood-tracker";
import { MoodChart } from "@/components/ui/mood-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Save, Heart } from "lucide-react";

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  note?: string;
}

const MoodTrackerPage = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: "1", date: new Date(), mood: 1 },
    { id: "2", date: new Date(Date.now() - 86400000), mood: 3 },
    { id: "3", date: new Date(Date.now() - 2 * 86400000), mood: 2 },
    { id: "4", date: new Date(Date.now() - 3 * 86400000), mood: 4 },
    { id: "5", date: new Date(Date.now() - 4 * 86400000), mood: 1 },
  ]);

  const handleSaveMood = () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date(),
        mood: selectedMood
      };
      
      setMoodEntries([newEntry, ...moodEntries]);
      setSelectedMood(null);
    }
  };

  // Prepare data for chart
  const chartData = moodEntries
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(entry => ({
      date: format(entry.date, "MMM d"),
      mood: entry.mood
    }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/15 p-2 rounded-full">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Mood Tracker</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Gently track your emotional well-being
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MoodTracker 
                selectedMood={selectedMood} 
                onMoodSelect={setSelectedMood} 
              />
              <Button 
                className="w-full rounded-full bg-primary hover:bg-primary/90" 
                onClick={handleSaveMood}
                disabled={!selectedMood}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Mood
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Moods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moodEntries.slice(0, 5).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30">
                    <div>
                      <p className="font-medium text-sm">
                        {format(entry.date, "MMM d")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(entry.date, "h:mm a")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {entry.mood === 1 && "Happy"}
                        {entry.mood === 2 && "Excited"}
                        {entry.mood === 3 && "Neutral"}
                        {entry.mood === 4 && "Sad"}
                        {entry.mood === 5 && "Angry"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <MoodChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerPage;