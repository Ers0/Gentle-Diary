import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Smile, Calendar, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/15 p-4 rounded-full">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Your Gentle Diary</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            A cozy space for your thoughts and feelings
          </p>
          <div className="flex justify-center gap-3">
            <Button size="lg" className="rounded-full px-6 bg-primary hover:bg-primary/90" asChild>
              <Link to="/diary">Start Writing</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          <div className="bg-card rounded-2xl p-6 text-center border border-border/50 shadow-sm hover:shadow-md transition-shadow hover:border-primary/30">
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Digital Journal</h3>
            <p className="text-sm text-muted-foreground">
              Write your thoughts in a distraction-free space
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 text-center border border-border/50 shadow-sm hover:shadow-md transition-shadow hover:border-secondary/30">
            <div className="bg-secondary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
              <Smile className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-medium mb-2">Mood Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Gently monitor your emotional well-being
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 text-center border border-border/50 shadow-sm hover:shadow-md transition-shadow hover:border-accent/30">
            <div className="bg-accent/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-medium mb-2">Daily Reflection</h3>
            <p className="text-sm text-muted-foreground">
              Build a habit of mindful reflection
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            A peaceful corner of the internet just for you
          </p>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;