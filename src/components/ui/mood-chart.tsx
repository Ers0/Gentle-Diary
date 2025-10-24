"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MoodData {
  date: string;
  mood: number;
}

interface MoodChartProps {
  data: MoodData[];
}

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  // Mood labels for Y-axis
  const moodLabels = ["", "Happy", "Excited", "Neutral", "Sad", "Angry"];
  
  // Color mapping for moods
  const moodColors = ["", "#10B981", "#FBBF24", "#9CA3AF", "#3B82F6", "#EF4444"];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border/50 p-3 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Mood: <span className="font-medium">{moodLabels[payload[0].value]}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
      {data.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis 
                domain={[0.5, 5.5]} 
                tickCount={6}
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => moodLabels[value] || ""}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                reversed={true}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mood" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={moodColors[entry.mood]} 
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No mood data yet. Start tracking your moods to see trends!</p>
        </div>
      )}
      
      {/* Mood Legend */}
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        {moodLabels.slice(1).map((label, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: moodColors[index + 1] }}
            />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { MoodChart };