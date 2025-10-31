"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const COLORS = [
  "#000000", // Black
  "#78716c", // Stone
  "#dc2626", // Red
  "#ea580c", // Orange
  "#d97706", // Amber
  "#ca8a04", // Yellow
  "#65a30d", // Lime
  "#16a34a", // Green
  "#0891b2", // Cyan
  "#0284c7", // Blue
  "#4338ca", // Indigo
  "#7c3aed", // Violet
  "#c026d3", // Fuchsia
  "#db2777", // Pink
  "#e11d48", // Rose
];

export function ColorPicker({ onColorSelect, onClose }: ColorPickerProps) {
  return (
    <Card className="shadow-lg z-50">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Text Color</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border border-border/50 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}