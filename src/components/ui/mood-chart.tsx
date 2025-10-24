"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface MoodDataPoint {
  date: string;
  mood: number;
}

interface MoodChartProps {
  data: MoodDataPoint[];
}

export function MoodChart({ data }: MoodChartProps) {
  // Map mood numbers to labels
  const moodLabels: Record<number, string> = {
    1: "Happy",
    2: "Excited",
    3: "Neutral",
    4: "Sad",
    5: "Angry"
  };

  const moodColors: Record<number, string> = {
    1: "#fbbf24", // Happy - yellow
    2: "#ec4899", // Excited - pink
    3: "#9ca3af", // Neutral - gray
    4: "#3b82f6", // Sad - blue
    5: "#ef4444"  // Angry - red
  };

  const chartData = data.map(item => ({
    ...item,
    moodLabel: moodLabels[item.mood],
    moodColor: moodColors[item.mood]
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                domain={[0, 6]} 
                tickCount={6}
                tickFormatter={(value) => moodLabels[value] || value}
              />
              <Tooltip 
                formatter={(value) => [moodLabels[Number(value)], "Mood"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="mood" 
                name="Mood"
                fill="#8884d8"
                label={{ position: 'top', formatter: (value) => moodLabels[Number(value)] }}
              >
                {chartData.map((entry, index) => (
                  <rect 
                    key={`bar-${index}`} 
                    fill={entry.moodColor} 
                    x={0} 
                    y={0} 
                    width={30} 
                    height={30} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}