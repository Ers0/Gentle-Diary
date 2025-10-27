import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Smile, Calendar, Heart, Sparkles, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-amber-50/30 to-orange-50/30 flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur opacity-30 animate-pulse"></div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 rounded-full relative">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            Your Gentle Diary
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A premium sanctuary for your thoughts and feelings
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <Link to="/diary">Begin Your Journey</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Digital Journal</h3>
              <p className="text-muted-foreground">
                Write your thoughts in a distraction-free, elegant space designed for reflection
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Smile className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Mood Tracking</h3>
              <p className="text-muted-foreground">
                Gently monitor your emotional well-being with insightful analytics
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-rose-400 to-pink-500 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Daily Reflection</h3>
              <p className="text-muted-foreground">
                Build a meaningful habit of mindful reflection with gentle reminders
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold mb-6">Premium Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Mood Insights</h3>
                <p className="text-sm text-muted-foreground">Personalized emotional analysis</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Elegant Typography</h3>
                <p className="text-sm text-muted-foreground">Beautifully crafted writing experience</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Heart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Privacy First</h3>
                <p className="text-sm text-muted-foreground">Your thoughts are securely encrypted</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lifetime Access</h3>
                <p className="text-sm text-muted-foreground">One-time payment for forever access</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <p className="text-muted-foreground">
            A premium corner of the internet just for you
          </p>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;