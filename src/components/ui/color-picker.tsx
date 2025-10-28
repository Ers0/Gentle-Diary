"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const COLORS = [
  "#000000", "#7f1d1d", "#365314", "#1e3a8a", "#581c87",
  "#431407", "#44403c", "#164e63", "#0f766e", "#3f6212",
  "#881337", "#be123c", "#dc2626", "#ea580c", "#d97706",
  "#ca8a04", "#65a30d", "#059669", "#0891b2", "#0284c7",
  "#4338ca", "#7c3aed", "#c026d3", "#db2777", "#e11d48"
];

export function ColorPicker({ onColorSelect, onClose }: ColorPickerProps) {
  const handleColorSelect = (color: string) => {
    onColorSelect(color);
  };

  // Close color picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.color-picker-container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="color-picker-container absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-border/50">
      <div className="grid grid-cols-5 gap-2">
        {COLORS.map((color) => (
          <Button
            key={color}
            variant="ghost"
            size="icon"
            className="w-6 h-6 rounded-full p-0 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}