// Custom remark plugin to handle font sizes
export const remarkFontSize = () => {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === 'text') {
        // Replace font size tags with HTML span elements
        node.value = node.value
          .replace(/\{small\}(.*?)\{\/small\}/g, '<span class="text-xs">$1</span>')
          .replace(/\{normal\}(.*?)\{\/normal\}/g, '<span class="text-sm">$1</span>')
          .replace(/\{large\}(.*?)\{\/large\}/g, '<span class="text-lg">$1</span>')
          .replace(/\{xlarge\}(.*?)\{\/xlarge\}/g, '<span class="text-xl">$1</span>');
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    
    visit(tree);
  };
};

// Custom components for react-markdown
export const markdownComponents = {
  h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-xl font-semibold mt-3 mb-2 text-muted-foreground" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />,
  p: ({ node, ...props }: any) => <p className="mb-2" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="my-2 list-disc pl-5" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="my-2 list-decimal pl-5" {...props} />,
  li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
  blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-2" {...props} />,
  hr: ({ node, ...props }: any) => <hr className="my-4 border-border" {...props} />,
  strong: ({ node, ...props }: any) => <strong className="font-bold" {...props} />,
  em: ({ node, ...props }: any) => <em className="italic" {...props} />,
  u: ({ node, ...props }: any) => <u className="underline" {...props} />,
  // Handle custom HTML elements - removed className from props to prevent conflicts
  span: ({ node, ...props }: any) => <span {...props} />,
};