"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface MoodChartProps {
  data: { date: string; mood: number }[];
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

  // Format data for chart
  const chartData = data.map(item => ({
    ...item,
    moodLabel: moodLabels[item.mood] || "Unknown"
  }));

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              domain={[0.5, 5.5]}
              tickCount={6}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => moodLabels[value] || value}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.5rem"
              }}
              formatter={(value) => [moodLabels[Number(value)] || value, "Mood"]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mood"
              name="Mood"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}