import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { 
  Save, 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered,
  Quote,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number | null;
  bookId?: string;
}

interface DiaryEditorProps {
  entry: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
  currentBookId?: string | null;
}

export const DiaryEditor = ({ entry, onSave, currentBookId }: DiaryEditorProps) => {
  const [content, setContent] = useState(entry.content);
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Load auto-subtitle settings
  const [autoSubtitle, setAutoSubtitle] = useState(false);
  const [subtitleLines, setSubtitleLines] = useState(3);
  
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
  
  // Extract title from first line of content
  useEffect(() => {
    const lines = entry.content.split('\n');
    if (lines.length > 0 && lines[0].startsWith('# ')) {
      setTitle(lines[0].substring(2));
      setContent(lines.slice(1).join('\n'));
    } else {
      setTitle(lines[0] || "");
      setContent(lines.slice(1).join('\n'));
    }
  }, [entry.content]);

  const handleSave = () => {
    // Format content with title
    let formattedContent = "";
    
    if (title.trim()) {
      formattedContent += `# ${title}\n\n`;
    }
    
    formattedContent += content;
    
    onSave({
      ...entry,
      content: formattedContent,
      bookId: currentBookId || entry.bookId
    });
    
    toast({
      title: "Entry saved",
      description: "Your diary entry has been saved successfully.",
    });
  };

  const insertFormatting = (prefix: string, suffix: string = "", block: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = "";
    let newCursorPos = start;
    
    if (block) {
      // For block elements like headings, quotes, dividers
      const lines = content.split('\n');
      const lineStart = content.substring(0, start).split('\n').length - 1;
      lines[lineStart] = prefix + lines[lineStart];
      newText = lines.join('\n');
      newCursorPos = start + prefix.length;
    } else if (selectedText) {
      // For inline formatting with selected text
      newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
      newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    } else {
      // For inserting formatting characters at cursor position
      newText = content.substring(0, start) + prefix + content.substring(end);
      newCursorPos = start + prefix.length;
    }
    
    setContent(newText);
    
    // Set cursor position
    setTimeout(() => {
      if (textarea) {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const insertList = (ordered: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      // Convert selected text to list
      const lines = selectedText.split('\n');
      const listLines = lines.map((line, index) => 
        ordered ? `${index + 1}. ${line}` : `- ${line}`
      );
      
      const newText = content.substring(0, start) + listLines.join('\n') + content.substring(end);
      setContent(newText);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        if (textarea) {
          const newCursorPos = start + listLines.join('\n').length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    } else {
      // Insert list marker at cursor
      const listMarker = ordered ? "1. " : "- ";
      const newText = content.substring(0, start) + listMarker + content.substring(end);
      setContent(newText);
      
      // Set cursor position after list marker
      setTimeout(() => {
        if (textarea) {
          const newCursorPos = start + listMarker.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && autoSubtitle) {
      // Check if we should auto-create a subtitle
      const textBeforeCursor = content.substring(0, textareaRef.current?.selectionStart || 0);
      const lines = textBeforeCursor.split('\n');
      
      // Count non-empty lines
      const nonEmptyLines = lines.filter(line => line.trim() !== '');
      
      if (nonEmptyLines.length === subtitleLines) {
        // Auto-insert subtitle formatting
        const cursorPos = textareaRef.current?.selectionStart || 0;
        const newContent = content.substring(0, cursorPos) + 
          '\n## ' + 
          content.substring(cursorPos);
        setContent(newContent);
        e.preventDefault();
        
        // Move cursor to after "## "
        setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPos = cursorPos + 4; // 4 = length of "\n## "
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            textareaRef.current.focus();
          }
        }, 0);
      }
    }
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder:text-muted-foreground"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {format(entry.date, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        
        <div className="border-b border-border/50 pb-3 mb-4">
          <div className="flex flex-wrap gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertFormatting("**", "**")}
              aria-label="Bold"
            >
              <Bold className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertFormatting("*", "*")}
              aria-label="Italic"
            >
              <Italic className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertFormatting("__", "__")}
              aria-label="Underline"
            >
              <Underline className="h-3 w-3" />
            </Button>
            <div className="w-px bg-border mx-1" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertFormatting("# ", "", true)}
              aria-label="Heading 1"
            >
              <Heading1 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertFormatting("## ", "", true)}
              aria-label="Heading 2"
            >
              <Heading2 className="h-3 w-3" />
            </Button>
            <div className="w-px bg-border mx-1" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertList(false)}
              aria-label="Bullet List"
            >
              <List className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertList(true)}
              aria-label="Numbered List"
            >
              <ListOrdered className="h-3 w-3" />
            </Button>
            <div className="w-px bg-border mx-1" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertFormatting("> ", "", true)}
              aria-label="Quote"
            >
              <Quote className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => insertFormatting("---\n", "", true)}
              aria-label="Divider"
            >
              <Minus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts here..."
          className="min-h-[400px] resize-none border-0 p-0 focus-visible:ring-0"
          onKeyDown={handleKeyDown}
        />
        
        <div className="mt-6 flex justify-end">
          <Button 
            className="rounded-full px-5 bg-primary hover:bg-primary/90"
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};