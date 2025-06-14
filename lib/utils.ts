import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/markdown.js
import { marked } from 'marked';

export async function markdownToHtml(markdown: string) {
  // Configure marked for GFM (tables, task lists, etc.)
  marked.setOptions({
    gfm: true,
    breaks: true, // Optional: Convert newlines to <br>
  });

  // Convert Markdown to HTML
  const html = await marked(markdown);
  return html;
}
