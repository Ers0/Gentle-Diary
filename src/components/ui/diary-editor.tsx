import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Save, Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered } from "lucide-react";
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
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
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

  const applyFormatting = (formatType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = "";
    let cursorOffset = 0;
    
    switch (formatType) {
      case "bold":
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case "underline":
        formattedText = `__${selectedText}__`;
        cursorOffset = 2;
        break;
      case "h1":
        formattedText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case "h2":
        formattedText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      case "ul":
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      case "ol":
        formattedText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        break;
      default:
        return;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + formattedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && autoSubtitle) {
      // Check if we should auto-create a subtitle
      const lines = content.substring(0, textareaRef.current?.selectionStart || 0).split('\n');
      if (lines.length === subtitleLines) {
        // Auto-insert subtitle formatting
        const newContent = content.substring(0, textareaRef.current?.selectionStart || 0) + 
          '\n## ' + 
          content.substring(textareaRef.current?.selectionStart || 0);
        setContent(newContent);
        e.preventDefault();
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
              onClick={() => applyFormatting("bold")}
              aria-label="Bold"
            >
              <Bold className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => applyFormatting("italic")}
              aria-label="Italic"
            >
              <Italic className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => applyFormatting("underline")}
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
              onClick={() => applyFormatting("h1")}
              aria-label="Heading 1"
            >
              <Heading1 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => applyFormatting("h2")}
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
              onClick={() => applyFormatting("ul")}
              aria-label="Bullet List"
            >
              <List className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={() => applyFormatting("ol")}
              aria-label="Numbered List"
            >
              <ListOrdered className="h-3 w-3" />
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