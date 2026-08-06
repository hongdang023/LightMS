import React from 'react';

export const renderRichText = (text: string): React.ReactNode => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let currentLine = line;
    const isQuote = currentLine.startsWith('> ');
    if (isQuote) {
      currentLine = currentLine.substring(2);
    }

    // Parser for inline markdown styling (Bold, Italic, Underline, Link)
    const regex =
      /\[(.*?)\]\((.*?)\)|\*\*(.*?)\*\*|\*(.*?)\*|<u>(.*?)<\/u>|<em[^>]*>(.*?)<\/em>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(currentLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(currentLine.substring(lastIndex, match.index));
      }
      if (match[1] && match[2]) {
        parts.push(
          <a
            key={match.index}
            href={match[2]}
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 hover:underline font-bold"
          >
            {match[1]}
          </a>
        );
      } else if (match[3]) {
        parts.push(
          <strong key={match.index} className="font-extrabold text-[#15333B]">
            {match[3]}
          </strong>
        );
      } else if (match[4]) {
        parts.push(
          <em key={match.index} className="italic text-[#3E5E63]">
            {match[4]}
          </em>
        );
      } else if (match[5]) {
        parts.push(
          <u key={match.index} className="underline">
            {match[5]}
          </u>
        );
      } else if (match[6]) {
        parts.push(
          <em key={match.index} className="italic text-[#3E5E63]">
            {match[6]}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < currentLine.length) {
      parts.push(currentLine.substring(lastIndex));
    }

    const parsedLine = parts.length > 0 ? <>{parts}</> : currentLine;

    if (isQuote) {
      return (
        <blockquote
          key={idx}
          className="border-l-4 border-yellow-500 pl-4 py-2 my-2 bg-yellow-50 rounded-r-lg text-gray-700 italic shadow-sm"
        >
          {parsedLine}
        </blockquote>
      );
    }

    return (
      <div key={idx} className="min-h-[1.5em] my-1 text-[#3E5E63]">
        {parsedLine}
      </div>
    );
  });
};

export const applyFormatting = (
  editorId: string,
  format: 'bold' | 'italic' | 'underline' | 'clear',
  onTextUpdated?: (cleanText: string) => void
) => {
  const editor = document.getElementById(editorId) as HTMLDivElement;
  if (!editor) return;

  editor.focus();

  if (format === 'bold') {
    document.execCommand('bold', false);
  } else if (format === 'italic') {
    document.execCommand('italic', false);
  } else if (format === 'underline') {
    document.execCommand('underline', false);
  } else if (format === 'clear') {
    document.execCommand('removeFormat', false);
  }

  const html = editor.innerHTML;
  const cleanText = html
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
    .replace(/<div><br><\/div>/gi, '\n')
    .replace(/<div>(.*?)<\/div>/gi, '\n$1')
    .replace(/<br>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .trim();

  if (onTextUpdated) {
    onTextUpdated(cleanText);
  }
};
