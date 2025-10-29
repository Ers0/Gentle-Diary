"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bold, 
  Italic, 
  Underline, 
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

export function DiaryEditor({ entry, onSave, currentBookId }: DiaryEditorProps) {
  const [content, setContent] = useState(entry.content);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setContent(entry.content);
  }, [entry.content]);

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

  const executeCommand = (command: string, value: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    document.execCommand(command, false, value);
    
    // Fix for numbered lists - force proper formatting
    if (command === 'insertOrderedList' && editorRef.current) {
      // Get all ol elements and ensure they have proper styling
      const orderedLists = editorRef.current.querySelectorAll('ol');
      orderedLists.forEach(ol => {
        ol.style.listStyleType = 'decimal';
        ol.style.paddingLeft = '1.25rem';
        ol.style.marginTop = '0.5rem';
        ol.style.marginBottom = '0.5rem';
      });
    }
    
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    document.execCommand('insertHTML', false, html);
    
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        executeCommand('bold');
        break;
      case 'italic':
        executeCommand('italic');
        break;
      case 'underline':
        executeCommand('underline');
        break;
      case 'heading1':
        executeCommand('formatBlock', '<h1>');
        break;
      case 'heading2':
        executeCommand('formatBlock', '<h2>');
        break;
      case 'heading3':
        executeCommand('formatBlock', '<h3>');
        break;
      case 'bulletList':
        executeCommand('insertUnorderedList');
        break;
      case 'numberedList':
        // Fixed implementation for numbered lists
        executeCommand('insertOrderedList');
        break;
      case 'blockquote':
        executeCommand('formatBlock', '<blockquote>');
        break;
      case 'alignLeft':
        executeCommand('justifyLeft');
        break;
      case 'alignCenter':
        executeCommand('justifyCenter');
        break;
      case 'alignRight':
        executeCommand('justifyRight');
        break;
      case 'horizontalRule':
        insertHTML('<hr />');
        break;
      case 'fontSize':
        // Custom font size implementation
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          const range = selection.getRangeAt(0);
          const selectedText = selection.toString();
          
          let sizeClass = '';
          switch (fontSize) {
            case 'small': sizeClass = 'text-xs'; break;
            case 'normal': sizeClass = 'text-sm'; break;
            case 'large': sizeClass = 'text-lg'; break;
            case 'xlarge': sizeClass = 'text-xl'; break;
            default: sizeClass = 'text-sm';
          }
          
          const span = document.createElement('span');
          span.className = sizeClass;
          span.textContent = selectedText;
          
          range.deleteContents();
          range.insertNode(span);
          
          if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
          }
        }
        break;
    }
  };

  const handleColorSelect = (color: string) => {
    executeCommand('foreColor', color);
    setIsColorPickerOpen(false);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    formatText('fontSize');
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
                onClick={() => formatText('heading1')}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('heading2')}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('heading3')}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('bold')}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('italic')}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('underline')}
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('alignLeft')}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('alignCenter')}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('alignRight')}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('bulletList')}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('numberedList')}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('blockquote')}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('horizontalRule')}
                title="Divider"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  title="Text Color"
                >
                  <Palette className="h-4 w-4" />
                </Button>
                {isColorPickerOpen && (
                  <div className="absolute top-full left-0 mt-1 z-10">
                    <ColorPicker
                      onColorSelect={handleColorSelect}
                      onClose={() => setIsColorPickerOpen(false)}
                    />
                  </div>
                )}
              </div>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              {/* Improved font size selection */}
              <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                <Button
                  variant={fontSize === 'small' ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full h-7 px-2"
                  onClick={() => setFontSize('small')}
                  title="Small Text"
                >
                  <span className="text-xs">S</span>
                </Button>
                <Button
                  variant={fontSize === 'normal' ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full h-7 px-2"
                  onClick={() => setFontSize('normal')}
                  title="Normal Text"
                >
                  <span className="text-sm">N</span>
                </Button>
                <Button
                  variant={fontSize === 'large' ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full h-7 px-2"
                  onClick={() => setFontSize('large')}
                  title="Large Text"
                >
                  <span className="text-lg">L</span>
                </Button>
                <Button
                  variant={fontSize === 'xlarge' ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full h-7 px-2"
                  onClick={() => setFontSize('xlarge')}
                  title="Extra Large Text"
                >
                  <span className="text-xl">XL</span>
                </Button>
              </div>
              
              <div className="border-r border-border/50 h-6 my-auto mx-1"></div>
              
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => executeCommand('undo')}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => executeCommand('redo')}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Editor Content */}
          <div className="p-6">
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[500px] p-4 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 prose prose-stone dark:prose-invert max-w-none prose-headings:font-heading prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-h3:font-medium prose-p:text-base prose-p:leading-relaxed prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5"
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: content }}
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