"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo
} from "lucide-react";
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

export function DiaryEditor({ entry, onSave, currentBookId }: DiaryEditorProps) {
  const [content, setContent] = useState(entry.content);
  const { toast } = useToast();

  const handleSave = () => {
    onSave({
      ...entry,
      content,
      bookId: currentBookId,
    });
    
    toast({
      title: "Entry saved",
      description: "Your diary entry has been saved successfully.",
    });
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('diary-content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading1':
        formattedText = `# ${selectedText}`;
        break;
      case 'heading2':
        formattedText = `## ${selectedText}`;
        break;
      case 'bulletList':
        formattedText = `- ${selectedText}`;
        break;
      case 'numberedList':
        formattedText = `1. ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + formattedText.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="border-b border-border/50 p-3 flex flex-wrap gap-1">
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => insertFormatting('heading1')}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => insertFormatting('heading2')}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => insertFormatting('bold')}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => insertFormatting('italic')}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => insertFormatting('bulletList')}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => insertFormatting('numberedList')}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => insertFormatting('quote')}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  const textarea = document.getElementById('diary-content') as HTMLTextAreaElement;
                  if (textarea) {
                    textarea.focus();
                  }
                }}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  const textarea = document.getElementById('diary-content') as HTMLTextAreaElement;
                  if (textarea) {
                    textarea.focus();
                  }
                }}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Editor Content */}
          <div className="p-6">
            <textarea
              id="diary-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[500px] p-4 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm"
              placeholder="Begin your gentle reflection..."
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