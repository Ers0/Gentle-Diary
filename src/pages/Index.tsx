// Update this page (the content is just a fallback if you fail to update the page)

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Smile, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Personal Diary & Mood Tracker</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Capture your thoughts, track your emotions, and reflect on your journey - all in one beautiful app.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/diary">Get Started</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-center">Digital Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Write your thoughts, experiences, and reflections with our distraction-free editor.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Smile className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-center">Mood Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Monitor your emotional well-being with our intuitive mood tracking system.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mb-4 mx-auto" />
              <CardTitle className="text-center">Daily Reflection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Build a habit of daily reflection and personal growth.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Designed for Your Well-being</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our diary app combines the best of journaling and mood tracking in a clean, 
            Evernote-inspired interface that helps you focus on what matters most - your thoughts and feelings.
          </p>
          <Button size="lg" variant="outline" asChild>
            <Link to="/diary">Start Your Journey</Link>
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;