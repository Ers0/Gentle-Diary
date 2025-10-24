"use client";

import React, { useState, useEffect } from "react";
import { MoodTracker } from "@/components/ui/mood-tracker";
import { MoodChart } from "@/components/ui/mood-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Save, Heart, Sparkles, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  note?: string;
}

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
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
  
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [moodInsights, setMoodInsights] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Load diary entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        // Convert date strings back to Date objects
        const entriesWithDates = parsedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setDiaryEntries(entriesWithDates);
      } catch (e) {
        console.error("Failed to parse saved entries", e);
      }
    }
  }, []);

  const handleSaveMood = () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date(),
        mood: selectedMood
      };
      
      setMoodEntries([newEntry, ...moodEntries]);
      setSelectedMood(null);
      
      toast({
        title: "Mood saved",
        description: "Your mood has been recorded for today.",
      });
    }
  };

  // Prepare data for chart
  const chartData = moodEntries
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(entry => ({
      date: format(entry.date, "MMM d"),
      mood: entry.mood
    }));

  // Get today's diary entries
  const getTodaysEntries = () => {
    const today = new Date();
    return diaryEntries.filter(entry => 
      entry.date.getDate() === today.getDate() &&
      entry.date.getMonth() === today.getMonth() &&
      entry.date.getFullYear() === today.getFullYear()
    );
  };

  // AI Mood Analysis function
  const analyzeMood = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const todaysEntries = getTodaysEntries();
      
      if (todaysEntries.length === 0) {
        setMoodInsights("No diary entries found for today. Write an entry to get personalized mood insights!");
        setIsAnalyzing(false);
        return;
      }
      
      // Combine all today's entries for analysis
      const combinedContent = todaysEntries.map(entry => entry.content).join(" ");
      
      // Simple keyword-based mood analysis (simulating AI)
      const keywords = {
        frustrated: ["frustrated", "annoyed", "irritated", "stuck", "difficult", "challenging"],
        anxious: ["anxious", "worried", "nervous", "stress", "concern", "tense"],
        happy: ["happy", "joy", "excited", "pleased", "delighted", "wonderful"],
        sad: ["sad", "depressed", "down", "blue", "unhappy", "miserable"],
        tired: ["tired", "exhausted", "fatigued", "drained", "weary"],
        grateful: ["grateful", "thankful", "appreciate", "blessed", "fortunate"],
        overwhelmed: ["overwhelmed", "burdened", "swamped", "drowning", "pressure"]
      };
      
      const detectedMoods: string[] = [];
      
      // Check for each mood keyword
      Object.entries(keywords).forEach(([mood, words]) => {
        const found = words.some(word => 
          combinedContent.toLowerCase().includes(word.toLowerCase())
        );
        
        if (found) {
          detectedMoods.push(mood);
        }
      });
      
      // Generate insights based on detected moods
      if (detectedMoods.length > 0) {
        // Create observations based on detected moods
        let observations = "";
        
        if (detectedMoods.includes("frustrated")) {
          observations = "When you feel frustrated, it often indicates challenges that require patience and new approaches.";
        } else if (detectedMoods.includes("anxious")) {
          observations = "Anxiety often reflects uncertainty about future events. Acknowledging these feelings is the first step toward managing them.";
        } else if (detectedMoods.includes("sad")) {
          observations = "Sadness is a natural emotion that helps process difficult experiences. It often signals a need for self-compassion.";
        } else if (detectedMoods.includes("tired")) {
          observations = "Feeling tired may indicate a need for better work-life balance or more restorative activities.";
        } else if (detectedMoods.includes("overwhelmed")) {
          observations = "Feeling overwhelmed suggests you might be taking on too much. Prioritization and delegation could help.";
        } else if (detectedMoods.includes("happy") || detectedMoods.includes("grateful")) {
          observations = "Positive emotions like happiness and gratitude are indicators of well-being and satisfaction with life.";
        } else {
          observations = "Recognizing your emotional patterns helps build self-awareness and emotional intelligence.";
        }
        
        const moodText = detectedMoods
          .map(mood => mood)
          .join(", ");
        
        setMoodInsights(`Key emotions detected: ${moodText}. ${observations}`);
      } else {
        setMoodInsights("Your entries don't show strong emotional indicators. This emotional balance suggests stability in your daily life.");
      }
      
      setIsAnalyzing(false);
    }, 1500);
  };

  // Mood descriptions for display
  const moodDescriptions = [
    { id: 1, label: "Happy", description: "Feeling joyful and content" },
    { id: 2, label: "Excited", description: "Full of energy and enthusiasm" },
    { id: 3, label: "Neutral", description: "Balanced and calm" },
    { id: 4, label: "Sad", description: "Feeling down or blue" },
    { id: 5, label: "Angry", description: "Feeling irritated or upset" }
  ];

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
                        {moodDescriptions.find(m => m.id === entry.mood)?.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* AI Mood Analysis Section */}
        <Card className="mt-6 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="bg-secondary/15 p-1.5 rounded-full">
                <Brain className="h-4 w-4 text-secondary" />
              </div>
              AI Mood Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Get personalized insights based on your diary entries
              </p>
              
              <Button 
                className="rounded-full bg-secondary hover:bg-secondary/90"
                onClick={analyzeMood}
                disabled={isAnalyzing}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isAnalyzing ? "Analyzing..." : "Analyze Today's Mood"}
              </Button>
              
              {moodInsights && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-sm">
                    <span className="font-medium">Insight:</span> {moodInsights}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <MoodChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerPage;