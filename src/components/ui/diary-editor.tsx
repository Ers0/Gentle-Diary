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
  ListChecks,
  Quote,
  Undo,
  Redo,
  Palette,
  Minus,
  Type
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
  const [isFontSizeMenuOpen, setIsFontSizeMenuOpen] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setContent(entry.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = entry.content || '<p><br></p>';
    }
  }, [entry.content]);

  const handleSave = () => {
    onSave({
      ...entry,
      content: editorRef.current ? editorRef.current.innerHTML : content,
      bookId: currentBookId,
    });
    
    toast({
      title: "Entry saved",
      description: "Your diary entry has been saved successfully.",
    });
  };

  // Add helpers for saving/restoring selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (savedSelection && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  };

  const executeCommand = (command: string, value: string = "") => {
    if (editorRef.current) {
      restoreSelection();
      editorRef.current.focus();
      (document as any).execCommand(command, false, value);
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement('div');
        div.innerHTML = html;
        const frag = document.createDocumentFragment();
        while (div.firstChild) {
          frag.appendChild(div.firstChild);
        }
        range.insertNode(frag);
        
        // Move cursor to the end of inserted content
        const lastNode = frag.lastChild;
        if (lastNode) {
          const newRange = document.createRange();
          newRange.setStartAfter(lastNode);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      } else {
        editorRef.current.innerHTML += html;
      }
      editorRef.current.focus();
    }
    
    // Update content state
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertCheckbox = () => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Create the checkbox input
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'mr-2 align-middle';
        
        // Create a text node for spacing
        const space = document.createTextNode(' ');
        
        // Insert both elements
        range.insertNode(checkbox);
        range.collapse(false); // Move to end of inserted content
        range.insertNode(space);
        range.collapse(false); // Move to end of space
        
        // Clear any existing selections and set the new one
        selection.removeAllRanges();
        selection.addRange(range);
        
        editorRef.current.focus();
      }
    }
    
    // Update content state
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Better font size handling that removes existing font tags
  const applyFontSize = (sizeClass: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // If no text is selected, apply to the entire line
        if (range.collapsed) {
          // Get the current line (paragraph or other block element)
          let container = range.startContainer;
          while (container && container.nodeType !== Node.ELEMENT_NODE) {
            container = container.parentNode;
          }
          
          // Apply font size to the container
          if (container) {
            const span = document.createElement('span');
            span.className = sizeClass;
            range.selectNodeContents(container);
            range.surroundContents(span);
          }
        } else {
          // Remove any existing font tags in the selection
          const selectedContent = range.extractContents();
          const tempDiv = document.createElement('div');
          tempDiv.appendChild(selectedContent);
          
          // Remove font tags
          const fontTags = tempDiv.querySelectorAll('font');
          fontTags.forEach(fontTag => {
            const parent = fontTag.parentNode;
            while (fontTag.firstChild) {
              parent?.insertBefore(fontTag.firstChild, fontTag);
            }
            parent?.removeChild(fontTag);
          });
          
          // Wrap with span with size class
          const span = document.createElement('span');
          span.className = sizeClass;
          span.appendChild(tempDiv);
          
          // Insert back into the document
          range.insertNode(span);
        }
        
        editorRef.current.focus();
      }
    }
    
    // Update content state
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Fixed toggleHeading with proper selection handling
  const toggleHeading = (level: 1 | 2 | 3) => {
    if (!editorRef.current) return;

    restoreSelection(); // restore before command
    editorRef.current.focus();

    const tag = `h${level}`;
    // execCommand is deprecated but works well for contentEditable
    (document as any).execCommand("formatBlock", false, tag);

    setContent(editorRef.current.innerHTML);
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
        toggleHeading(1);
        break;
      case 'heading2':
        toggleHeading(2);
        break;
      case 'heading3':
        toggleHeading(3);
        break;
      case 'bulletList':
        executeCommand('insertUnorderedList');
        break;
      case 'numberedList':
        executeCommand('insertOrderedList');
        break;
      case 'checkboxList':
        // Insert just the checkbox with proper cursor positioning
        insertCheckbox();
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
      case 'fontSizeSmall':
        applyFontSize('text-xs');
        break;
      case 'fontSizeNormal':
        applyFontSize('text-sm');
        break;
      case 'fontSizeLarge':
        applyFontSize('text-lg');
        break;
      case 'fontSizeXLarge':
        applyFontSize('text-xl');
        break;
    }
  };

  const handleColorSelect = (color: string) => {
    executeCommand('foreColor', color);
    setIsColorPickerOpen(false);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Handle editor clicks - prevent line clicks from affecting checkboxes
  const handleEditorClick = (e: React.MouseEvent) => {
    // If clicking directly on a checkbox, allow default behavior
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      return;
    }
    
    // If clicking on the text part of a checkbox item, prevent any checkbox interaction
    const parent = (e.target as HTMLElement).closest('div.flex.items-start');
    if (parent) {
      const checkbox = parent.querySelector('input[type="checkbox"]');
      if (checkbox) {
        // Prevent any checkbox interaction when clicking on the text
        e.preventDefault();
      }
    }
  };

  // Ensure editor always has content
  const handleBlur = () => {
    if (editorRef.current && editorRef.current.innerHTML.trim() === '') {
      editorRef.current.innerHTML = '<p><br></p>';
      setContent('<p><br></p>');
    }
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
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => formatText('checkboxList')}
                title="Checkbox List"
              >
                <ListChecks className="h-4 w-4" />
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
              
              {/* Improved font size selection dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-7 px-3 flex items-center gap-1"
                  onClick={() => setIsFontSizeMenuOpen(!isFontSizeMenuOpen)}
                  title="Font Size"
                >
                  <Type className="h-4 w-4" />
                  <span className="text-xs">Size</span>
                </Button>
                {isFontSizeMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 z-10 bg-background border border-border rounded-md shadow-lg w-32">
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none text-xs py-2 px-3"
                      onClick={() => {
                        formatText('fontSizeSmall');
                        setIsFontSizeMenuOpen(false);
                      }}
                    >
                      Small
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none text-sm py-2 px-3"
                      onClick={() => {
                        formatText('fontSizeNormal');
                        setIsFontSizeMenuOpen(false);
                      }}
                    >
                      Normal
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none text-lg py-2 px-3"
                      onClick={() => {
                        formatText('fontSizeLarge');
                        setIsFontSizeMenuOpen(false);
                      }}
                    >
                      Large
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none text-xl py-2 px-3"
                      onClick={() => {
                        formatText('fontSizeXLarge');
                        setIsFontSizeMenuOpen(false);
                      }}
                    >
                      Extra Large
                    </Button>
                  </div>
                )}
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
              className="min-h-[500px] p-4 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 prose prose-stone dark:prose-invert max-w-none prose-headings:font-heading prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-h3:font-medium prose-p:text-base prose-p:leading-relaxed prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-ul:list-disc [&_ul]:list-disc [&_ul_li]:list-disc [&_ul_li]:pl-2 prose-ol:list-decimal [&_ol]:list-decimal [&_ol_li]:list-decimal [&_ol_li]:pl-2 prose-li:my-1 [&_ul]:pl-4 [&_ol]:pl-4"
              onInput={handleInput}
              onClick={handleEditorClick}
              onBlur={handleBlur}
              onMouseUp={saveSelection}
              onKeyUp={saveSelection}
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