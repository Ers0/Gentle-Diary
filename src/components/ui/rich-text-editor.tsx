"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { CharacterCount } from "@tiptap/extension-character-count";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Highlighter,
  Palette,
  Link as LinkIcon,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [color, setColor] = useState("#000000");
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your diary entry...",
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setIsLinkPopoverOpen(false);
    }
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="border border-border rounded-lg flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="rounded-full"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="rounded-full"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          className="rounded-full"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          className="rounded-full"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          className="rounded-full"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          className="rounded-full"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          className="rounded-full"
        >
          <List className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          className="rounded-full"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          className="rounded-full"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Toggle
          size="sm"
          pressed={editor.isActive("textAlign", { align: "left" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
          className="rounded-full"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("textAlign", { align: "center" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
          className="rounded-full"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("textAlign", { align: "right" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
          className="rounded-full"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive("textAlign", { align: "justify" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
          className="rounded-full"
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <HexColorPicker color={color} onChange={setColor} />
            <div className="p-2 flex gap-1">
              <Button 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => editor.chain().focus().setColor(color).run()}
              >
                Apply
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 px-2 text-xs"
                onClick={() => editor.chain().focus().unsetColor().run()}
              >
                Reset
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full p-2 h-8 w-8"
              onClick={() => {
                if (editor.isActive("link")) {
                  unsetLink();
                }
              }}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter URL"
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={addLink}
                >
                  Add Link
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsLinkPopoverOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-xs"
                onClick={() => editor.chain().focus().setFontFamily("sans-serif").run()}
              >
                Sans Serif
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-xs"
                onClick={() => editor.chain().focus().setFontFamily("serif").run()}
              >
                <span className="font-serif">Serif</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-xs"
                onClick={() => editor.chain().focus().setFontFamily("monospace").run()}
              >
                <span className="font-mono">Monospace</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 p-4 overflow-auto">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px] focus:outline-none prose prose-stone dark:prose-invert max-w-none"
        />
      </div>
      
      {/* Character Count */}
      <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
        {editor.storage.characterCount?.characters() || 0} characters
      </div>
    </div>
  );
};

export default RichTextEditor;