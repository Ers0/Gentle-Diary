"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CharacterCount from "@tiptap/extension-character-count";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Highlight as HighlightIcon,
  Link as LinkIcon,
  Type,
  Hash,
  Calendar,
  Save,
  Palette
} from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { useTheme } from "@/components/theme-provider";
import { format } from "date-fns";

interface DiaryEditorProps {
  entry: {
    id: string;
    date: Date;
    content: string;
    mood?: number | null;
    bookId?: string;
  };
  onSave: (entry: any) => void;
  currentBookId?: string;
}

const DiaryEditor = ({ entry, onSave, currentBookId }: DiaryEditorProps) => {
  const { theme } = useTheme();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [autoSubtitle, setAutoSubtitle] = useState(false);
  const [subtitleLines, setSubtitleLines] = useState(3);

  // Load auto subtitle settings
  useEffect(() => {
    const savedAutoSubtitle = localStorage.getItem("autoSubtitle");
    const savedSubtitleLines = localStorage.getItem("subtitleLines");
    
    if (savedAutoSubtitle) {
      setAutoSubtitle(JSON.parse(savedAutoSubtitle));
    }
    
    if (savedSubtitleLines) {
      setSubtitleLines(parseInt(savedSubtitleLines));
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your thoughts...",
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      TextStyle,
      Color,
      CharacterCount,
    ],
    content: entry.content,
  });

  // Handle auto subtitle functionality
  useEffect(() => {
    if (!editor || !autoSubtitle) return;

    let lastLineCount = 0;

    const handleUpdate = () => {
      const content = editor.getText();
      const lines = content.split('\n');
      const currentLineCount = lines.length;

      // Check if we've crossed a threshold for adding a subtitle
      if (currentLineCount > lastLineCount && 
          currentLineCount > subtitleLines && 
          currentLineCount % subtitleLines === 0) {
        const lastLine = lines[lines.length - 1].trim();
        
        // Only add subtitle if the last line isn't empty and not already a heading
        if (lastLine && !lastLine.startsWith('## ')) {
          // We'll add a visual indicator instead of automatically inserting
          // to avoid disrupting the user's writing flow
          console.log("Auto subtitle threshold reached");
        }
      }

      lastLineCount = currentLineCount;
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, autoSubtitle, subtitleLines]);

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      onSave({
        ...entry,
        content,
        date: new Date(),
        bookId: currentBookId || entry.bookId
      });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/15 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{format(entry.date, "MMMM d, yyyy")}</h2>
            <p className="text-sm text-muted-foreground">
              {format(entry.date, "EEEE, h:mm a")}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          className="rounded-full bg-primary hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Entry
        </Button>
      </div>

      <Card className="flex-1 flex flex-col border-border/50 shadow-sm">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b border-border/50 p-2 flex flex-wrap gap-1">
            <Button
              variant={editor.isActive("bold") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().toggleBold().run()}
              aria-label="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("italic") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              aria-label="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("underline") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              aria-label="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("strike") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              aria-label="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            
            <div className="w-px bg-border/50 mx-1" />
            
            <Button
              variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              aria-label="Align left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              aria-label="Align center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              aria-label="Align right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              aria-label="Align justify"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
            
            <div className="w-px bg-border/50 mx-1" />
            
            <Button
              variant={editor.isActive("highlight") ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              aria-label="Highlight"
            >
              <HighlightIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              aria-label="Text color"
            >
              <Palette className="h-4 w-4" />
            </Button>
            
            {isColorPickerOpen && (
              <div className="absolute z-10 mt-8">
                <ColorPicker
                  onColorChange={(color) => {
                    editor.chain().focus().setColor(color).run();
                    setIsColorPickerOpen(false);
                  }}
                />
              </div>
            )}
            
            <div className="w-px bg-border/50 mx-1" />
            
            <Button
              variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              aria-label="Heading 1"
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              aria-label="Heading 2"
            >
              <Hash className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Editor */}
          <div className="flex-1 overflow-auto p-4">
            <EditorContent 
              editor={editor} 
              className="min-h-full focus:outline-none"
            />
          </div>
          
          {/* Character count */}
          <div className="border-t border-border/50 px-4 py-2 text-sm text-muted-foreground">
            {editor.storage.characterCount.characters()} characters
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { DiaryEditor };