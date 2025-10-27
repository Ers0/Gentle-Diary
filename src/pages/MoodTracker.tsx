"use client";

import React, { useState, useEffect } from "react";
import { MoodTracker } from "@/components/ui/mood-tracker";
import { MoodChart } from "@/components/ui/mood-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isSameDay, parseISO } from "date-fns";
import { Save, Heart, Sparkles, Brain, CalendarIcon, Languages } from "lucide-react";
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

// Mood data structure
const moodData = [
  { id: 1, label: "Happy", color: "bg-amber-500", emoji: "😊" },
  { id: 2, label: "Excited", color: "bg-orange-500", emoji: "😃" },
  { id: 3, label: "Neutral", color: "bg-slate-500", emoji: "😐" },
  { id: 4, label: "Sad", color: "bg-teal-500", emoji: "😢" },
  { id: 5, label: "Angry", color: "bg-rose-500", emoji: "😠" }
];

// Translations for mood insights
const translations = {
  en: {
    title: "Mood Tracker",
    subtitle: "Gently track your emotional well-being",
    howFeeling: "How are you feeling today?",
    saveMood: "Save Mood",
    moodHistory: "Mood History",
    aiInsights: "AI Mood Insights",
    getInsights: "Get personalized insights based on your diary entries",
    analyze: "Analyze Today's Mood",
    analyzing: "Analyzing...",
    insights: {
      frustrated: "It seems like you've been facing some challenges lately. Remember that frustration is often a sign that you're pushing through something important.",
      anxious: "I notice some anxiety in your writing today. It's completely natural to feel this way when we're uncertain about what's ahead.",
      happy: "Your words radiate positivity today! Moments like these are precious - savor them and let them fuel you during tougher times.",
      sad: "Your words suggest you've been feeling down. It's okay to sit with these feelings - they're part of being human.",
      tired: "You seem to be feeling drained today. Your body might be telling you it's time for some extra rest and care.",
      grateful: "Your words show gratitude today. Moments of appreciation are powerful anchors for well-being.",
      overwhelmed: "It looks like you're carrying a lot right now. That's a heavy load, and it's okay to ask for help or take a step back.",
      balanced: "Your entries today show a nice emotional balance. You seem to be in a peaceful state of mind, which is wonderful."
    },
    noEntries: "No diary entries found for today. Write an entry to get personalized mood insights!",
    predominantMood: "Predominant mood",
    noMoodEntries: "No mood entries for this date"
  },
  pt: {
    title: "Rastreador de Humor",
    subtitle: "Acompanhe gentilmente o seu bem-estar emocional",
    howFeeling: "Como você está se sentindo hoje?",
    saveMood: "Salvar Humor",
    moodHistory: "Histórico de Humor",
    aiInsights: "Insights de Humor com IA",
    getInsights: "Obtenha insights personalizados com base nas suas entradas de diário",
    analyze: "Analisar o Humor de Hoje",
    analyzing: "Analisando...",
    insights: {
      frustrated: "Parece que você tem enfrentado alguns desafios ultimamente. Lembre-se de que a frustração é frequentemente um sinal de que você está superando algo importante.",
      anxious: "Percebo alguma ansiedade na sua escrita hoje. É completamente natural sentir isso quando estamos incertos sobre o que está por vir.",
      happy: "Suas palavras transbordam positividade hoje! Momentos como esses são preciosos - saboreie-os e deixe que eles o fortaleçam nos momentos mais difíceis.",
      sad: "Suas palavras sugerem que você tem se sentido para baixo. Tudo bem ficar com esses sentimentos - eles fazem parte de ser humano.",
      tired: "Você parece estar se sentindo exausto hoje. Seu corpo pode estar dizendo que é hora de descansar um pouco mais.",
      grateful: "Suas palavras mostram gratidão hoje. Momentos de apreciação são âncoras poderosas para o bem-estar.",
      overwhelmed: "Parece que você está carregando muito agora. Essa é uma carga pesada, e tudo bem pedir ajuda ou dar um passo para trás.",
      balanced: "Suas entradas hoje mostram um bom equilíbrio emocional. Você parece estar em um estado de paz mental, o que é maravilhoso."
    },
    noEntries: "Nenhuma entrada de diário encontrada para hoje. Escreva uma entrada para obter insights personalizados de humor!",
    predominantMood: "Humor predominante",
    noMoodEntries: "Nenhuma entrada de humor para esta data"
  }
};

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [language, setLanguage] = useState<"en" | "pt">("en");
  const { toast } = useToast();
  
  const t = translations[language];

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
        title: language === "en" ? "Mood saved" : "Humor salvo",
        description: language === "en" 
          ? "Your mood has been recorded for today." 
          : "Seu humor foi registrado para hoje.",
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
        setMoodInsights(t.noEntries);
        setIsAnalyzing(false);
        return;
      }
      
      // Combine all today's entries for analysis
      const combinedContent = todaysEntries.map(entry => entry.content).join(" ");
      
      // Simple keyword-based mood analysis (simulating AI)
      const keywords = {
        frustrated: ["frustrated", "annoyed", "irritated", "stuck", "difficult", "challenging", "frustrado", "irritado", "preso", "difícil"],
        anxious: ["anxious", "worried", "nervous", "stress", "concern", "tense", "ansioso", "preocupado", "nervoso", "estresse"],
        happy: ["happy", "joy", "excited", "pleased", "delighted", "wonderful", "feliz", "alegria", "animado", "maravilhoso"],
        sad: ["sad", "depressed", "down", "blue", "unhappy", "miserable", "triste", "deprimido", "para baixo", "infeliz"],
        tired: ["tired", "exhausted", "fatigued", "drained", "weary", "cansado", "exausto", "fatigado", "esgotado"],
        grateful: ["grateful", "thankful", "appreciate", "blessed", "fortunate", "grato", "agradecido", "apreciar", "abençoado"],
        overwhelmed: ["overwhelmed", "burdened", "swamped", "drowning", "pressure", "sobrecarregado", "sobrecarregada", "afogado", "pressão"]
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
        // Create humanized observations based on detected moods
        let observations = "";
        
        if (detectedMoods.includes("frustrated")) {
          observations = t.insights.frustrated;
        } else if (detectedMoods.includes("anxious")) {
          observations = t.insights.anxious;
        } else if (detectedMoods.includes("sad")) {
          observations = t.insights.sad;
        } else if (detectedMoods.includes("tired")) {
          observations = t.insights.tired;
        } else if (detectedMoods.includes("overwhelmed")) {
          observations = t.insights.overwhelmed;
        } else if (detectedMoods.includes("happy") || detectedMoods.includes("grateful")) {
          observations = t.insights.happy;
        } else {
          observations = t.insights.balanced;
        }
        
        setMoodInsights(observations);
      } else {
        setMoodInsights(t.insights.balanced);
      }
      
      setIsAnalyzing(false);
    }, 1500);
  };

  // Get mood entries for a specific date
  const getEntriesForDate = (date: Date) => {
    return moodEntries.filter(entry => isSameDay(entry.date, date));
  };

  // Get predominant mood for a date
  const getPredominantMood = (date: Date) => {
    const entries = getEntriesForDate(date);
    if (entries.length === 0) return null;
    
    // Count mood occurrences
    const moodCounts: Record<number, number> = {};
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    // Find mood with highest count
    let maxCount = 0;
    let predominantMood = entries[0].mood;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        predominantMood = parseInt(mood);
      }
    });
    
    return moodData.find(m => m.id === predominantMood) || null;
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month to show
    const prevMonthDays = firstDay.getDay();
    
    // Total days to show (including next month)
    const totalDays = 42; // 6 weeks
    
    const days = [];
    
    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }
    
    // Next month days
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(date);
    }
    
    return days;
  };

  // Get mood entries for selected date
  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/15 p-2 rounded-full">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <div className="ml-auto">
            <Select value={language} onValueChange={(value: "en" | "pt") => setLanguage(value)}>
              <SelectTrigger className="w-[120px] rounded-full">
                <div className="flex items-center">
                  <Languages className="h-4 w-4 mr-2" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-muted-foreground mb-8">
          {t.subtitle}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t.howFeeling}</CardTitle>
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
                {t.saveMood}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t.moodHistory}</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={view === "calendar" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setView("calendar")}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant={view === "list" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setView("list")}
                >
                  List
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {view === "calendar" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((date, index) => {
                      const isCurrentMonth = date.getMonth() === new Date().getMonth();
                      const predominantMood = getPredominantMood(date);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      
                      return (
                        <div
                          key={index}
                          className={`h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                            isSelected 
                              ? 'ring-2 ring-primary' 
                              : 'hover:bg-muted/50'
                          } ${
                            isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                          onClick={() => {
                            setSelectedDate(date);
                          }}
                        >
                          <div className="relative">
                            <span className="text-sm">{date.getDate()}</span>
                            {predominantMood && (
                              <div 
                                className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${predominantMood.color}`}
                                title={language === "en" ? predominantMood.label : 
                                      predominantMood.label === "Happy" ? "Feliz" :
                                      predominantMood.label === "Excited" ? "Animado" :
                                      predominantMood.label === "Neutral" ? "Neutro" :
                                      predominantMood.label === "Sad" ? "Triste" : "Bravo"}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {selectedDate && (
                    <div className="pt-4 border-t border-border/50">
                      <h3 className="font-medium mb-2">
                        {format(selectedDate, "MMMM d, yyyy")} {t.entries}
                      </h3>
                      {selectedDateEntries.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedDateEntries.map(entry => {
                            const moodInfo = moodData.find(m => m.id === entry.mood);
                            return (
                              <div 
                                key={entry.id} 
                                className="flex items-center justify-between p-2 border border-border/50 rounded-lg"
                              >
                                <div className="flex items-center">
                                  {moodInfo && (
                                    <div className={`w-3 h-3 rounded-full ${moodInfo.color} mr-2`} />
                                  )}
                                  <span className="text-sm">
                                    {language === "en" ? moodInfo?.label : 
                                     moodInfo?.label === "Happy" ? "Feliz" :
                                     moodInfo?.label === "Excited" ? "Animado" :
                                     moodInfo?.label === "Neutral" ? "Neutro" :
                                     moodInfo?.label === "Sad" ? "Triste" : "Bravo"}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {format(entry.date, "h:mm a")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t.noMoodEntries}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {moodEntries
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 10)
                    .map(entry => {
                      const moodInfo = moodData.find(m => m.id === entry.mood);
                      return (
                        <div 
                          key={entry.id} 
                          className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30"
                        >
                          <div className="flex items-center">
                            {moodInfo && (
                              <div className={`w-3 h-3 rounded-full ${moodInfo.color} mr-2`} />
                            )}
                            <div>
                              <p className="font-medium text-sm">
                                {language === "en" ? moodInfo?.label : 
                                 moodInfo?.label === "Happy" ? "Feliz" :
                                 moodInfo?.label === "Excited" ? "Animado" :
                                 moodInfo?.label === "Neutral" ? "Neutro" :
                                 moodInfo?.label === "Sad" ? "Triste" : "Bravo"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(entry.date, "MMM d, h:mm a")}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
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
              {t.aiInsights}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {t.getInsights}
              </p>
              
              <Button 
                className="rounded-full bg-secondary hover:bg-secondary/90"
                onClick={analyzeMood}
                disabled={isAnalyzing}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isAnalyzing ? t.analyzing : t.analyze}
              </Button>
              
              {moodInsights && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-sm">
                    <span className="font-medium">{language === "en" ? "Insight:" : "Percepção:"}</span> {moodInsights}
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