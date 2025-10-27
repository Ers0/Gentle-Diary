"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Eye, SquarePen, Calendar, Smile } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { remarkFontSize, markdownComponents } from "@/utils/markdown.tsx";

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
  currentBookId?: string;
}

export function DiaryEditor({ entry, onSave, currentBookId }: DiaryEditorProps) {
  const [content, setContent] = useState(entry.content);
  const [isPreview, setIsPreview] = useState(false);
  const [mood, setMood] = useState<number | null>(entry.mood || null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSave = () => {
    const updatedEntry: DiaryEntry = {
      ...entry,
      content,
      mood,
      bookId: currentBookId || entry.bookId,
      date: new Date() // Update timestamp on save
    };
    
    onSave(updatedEntry);
    
    toast({
      title: "Entry saved",
      description: "Your diary entry has been saved successfully.",
    });
  };

  const handleInsertTitle = () => {
    const title = "# ";
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + title + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + title.length, start + title.length);
      }, 0);
    }
  };

  const handleInsertSubtitle = () => {
    const subtitle = "## ";
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + subtitle + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + subtitle.length, start + subtitle.length);
      }, 0);
    }
  };

  const handleInsertList = () => {
    const list = "- ";
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + list + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + list.length, start + list.length);
      }, 0);
    }
  };

  const handleInsertQuote = () => {
    const quote = "> ";
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + quote + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + quote.length, start + quote.length);
      }, 0);
    }
  };

  const handleInsertDivider = () => {
    const divider = "\n---\n";
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + divider + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + divider.length, start + divider.length);
      }, 0);
    }
  };

  const handleInsertFontSize = (size: string) => {
    const openingTag = `{${size}}`;
    const closingTag = `{/${size}}`;
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + openingTag + selectedText + closingTag + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + openingTag.length, start + openingTag.length + selectedText.length);
      }, 0);
    }
  };

  const handleInsertBold = () => {
    const bold = "**";
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + bold + selectedText + bold + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + bold.length, start + bold.length + selectedText.length);
      }, 0);
    }
  };

  const handleInsertItalic = () => {
    const italic = "*";
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + italic + selectedText + italic + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + italic.length, start + italic.length + selectedText.length);
      }, 0);
    }
  };

  const handleInsertUnderline = () => {
    const underline = "__";
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + underline + selectedText + underline + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + underline.length, start + underline.length + selectedText.length);
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/15 p-2 rounded-full">
            <SquarePen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Diary Entry</h1>
            <p className="text-sm text-muted-foreground">
              {format(entry.date, "MMMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isPreview ? "outline" : "secondary"} 
            size="sm" 
            className="rounded-full"
            onClick={() => setIsPreview(false)}
          >
            <SquarePen className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant={!isPreview ? "outline" : "secondary"} 
            size="sm" 
            className="rounded-full"
            onClick={() => setIsPreview(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button className="rounded-full bg-primary hover:bg-primary/90" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-border/50 shadow-sm">
        <CardContent className="p-0 flex-1 flex flex-col">
          {isPreview ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkFontSize]} 
                components={markdownComponents}
                className="prose prose-stone dark:prose-invert max-w-none"
              >
                {content || "Your entry is empty. Start writing to see the preview."}
              </ReactMarkdown>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 p-4 border-b border-border/50">
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInsertTitle}>
                  H1
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInsertSubtitle}>
                  H2
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInsertList}>
                  List
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInsertQuote}>
                  Quote
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInsertDivider}>
                  Divider
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleInsertFontSize("small")}>
                  Small
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleInsertFontSize("normal")}>
                  Normal
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleInsertFontSize("large")}>
                  Large
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleInsertFontSize("xlarge")}>
                  X-Large
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInsertBold}>
                  <strong>B</strong>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInsertItalic}>
                  <em>I</em>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInsertUnderline}>
                  <u>U</u>
                </Button>
              </div>
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your diary entry..."
                className="flex-1 border-0 rounded-none resize-none focus-visible:ring-0 p-6 text-base"
                style={{ minHeight: "300px" }}
              />
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mood:</span>
          {[1, 2, 3, 4, 5].map((moodValue) => (
            <Button
              key={moodValue}
              variant="outline"
              size="icon"
              className={`rounded-full w-8 h-8 ${
                mood === moodValue 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
              onClick={() => setMood(moodValue === mood ? null : moodValue)}
            >
              {moodValue === 1 && "😊"}
              {moodValue === 2 && "😃"}
              {moodValue === 3 && "😐"}
              {moodValue === 4 && "😢"}
              {moodValue === 5 && "😠"}
            </Button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {content.length} characters
        </div>
      </div>
    </div>
  );
}