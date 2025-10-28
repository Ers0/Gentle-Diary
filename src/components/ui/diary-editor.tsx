"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Palette,
  Minus
} from "lucide-react";
import { ColorPicker } from "./color-picker";
import { useToast } from "@/hooks/use-toast";

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

const CustomHeading1 = Heading1;
const CustomHeading2 = Heading2;
const CustomHeading3 = Heading3;

export function DiaryEditor({ entry, onSave, currentBookId }: DiaryEditorProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [autoSubtitle, setAutoSubtitle] = useState(() => {
    const saved = localStorage.getItem("autoSubtitle");
    return saved ? JSON.parse(saved) : false;
  });
  
  const [subtitleLines, setSubtitleLines] = useState(() => {
    const saved = localStorage.getItem("subtitleLines");
    return saved ? parseInt(saved) : 3;
  });
  
  const { toast } = useToast();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Begin your gentle reflection...",
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Highlight,
      CharacterCount,
    ],
    content: entry.content,
    onUpdate: ({ editor }) => {
      // Auto subtitle functionality
      if (autoSubtitle) {
        const content = editor.getHTML();
        const plainText = editor.getText();
        
        // Count lines in plain text
        const lines = plainText.split('\n').filter(line => line.trim() !== '');
        
        // Check if we should insert a subtitle
        if (lines.length >= subtitleLines && !content.includes('<h2')) {
          // Find the position after the specified number of lines
          const linesToCount = lines.slice(0, subtitleLines).join('\n').length + subtitleLines - 1;
          
          // Insert subtitle at that position
          editor.commands.insertContentAt(linesToCount, '<h2>Subtitle</h2><p></p>');
          editor.commands.focus(linesToCount + 15); // Focus after the subtitle
          
          toast({
            title: "Auto Subtitle Created",
            description: `Subtitle automatically added after ${subtitleLines} lines`,
          });
        }
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(entry.content);
    }
  }, [entry.content, editor]);

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      onSave({
        ...entry,
        content,
        bookId: currentBookId,
      });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="border-b border-border/50 p-3 flex flex-wrap gap-1">
            <div className="flex flex-wrap gap-1">
              <Button
                variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Title"
              >
                <CustomHeading1 className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Subtitle"
              >
                <CustomHeading2 className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Heading"
              >
                <CustomHeading3 className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant={editor.isActive("bold") ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive("underline") ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive("horizontalRule") ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Divider"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full relative"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                title="Text Color"
              >
                <Palette className="h-4 w-4" />
                {isColorPickerOpen && (
                  <div className="absolute top-full left-0 mt-1 z-10">
                    <ColorPicker
                      onColorSelect={(color) => {
                        editor.chain().focus().setColor(color).run();
                        setIsColorPickerOpen(false);
                      }}
                      onClose={() => setIsColorPickerOpen(false)}
                    />
                  </div>
                )}
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Editor Content */}
          <div className="p-6">
            <EditorContent 
              editor={editor} 
              className="min-h-[500px] focus:outline-none prose prose-stone dark:prose-invert max-w-none prose-headings:font-heading prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-h3:font-medium prose-p:text-base prose-p:leading-relaxed prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5" 
            />
          </div>
          
          {/* Footer with Save Button */}
          <div className="border-t border-border/50 p-4 flex justify-end">
            <Button 
              onClick={handleSave}
              className="rounded-full bg-primary hover:bg-primary/90 px-6"
            >
              Save Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}