"use client";

import React from "react";
import { HexColorPicker } from "react-colorful";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const presetColors = [
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
  "#ffffff", // White
];

export function ColorPicker({ onColorSelect, onClose }: ColorPickerProps) {
  const [color, setColor] = React.useState("#000000");

  const handleSelect = (selectedColor: string) => {
    setColor(selectedColor);
    onColorSelect(selectedColor);
  };

  return (
    <Card className="shadow-lg z-50">
      <CardContent className="p-4 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <HexColorPicker 
          color={color} 
          onChange={handleSelect} 
          className="w-full max-w-[200px]"
        />
        <div className="grid grid-cols-5 gap-2 mt-3">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              className="w-6 h-6 rounded-full border border-border/50"
              style={{ backgroundColor: presetColor }}
              onClick={() => handleSelect(presetColor)}
              aria-label={`Select color ${presetColor}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}