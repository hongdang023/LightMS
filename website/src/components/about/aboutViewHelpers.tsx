import React from 'react';

export const normalizeHtmlToMarkdown = (rawText: string): string => {
  if (!rawText) return '';
  if (!rawText.includes('<') && !rawText.includes('>')) return rawText;

  return rawText
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
      let idx = 1;
      return '\n' + inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, item: string) => `${idx++}. ${item.trim()}\n`) + '\n';
    })
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
      return '\n' + inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, item: string) => `- ${item.trim()}\n`) + '\n';
    })
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n')
    .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, '<u>$1</u>')
    .replace(/<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<\/?[a-z0-9]+[^>]*>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

export const renderRichText = (text: string): React.ReactNode => {
  if (!text) return null;
  const normalized = normalizeHtmlToMarkdown(text);
  const lines = normalized.split('\n');
  return lines.map((line, idx) => {
    let currentLine = line.trim();
    if (!currentLine) {
      return <div key={idx} className="h-1" />;
    }

    const isQuote = currentLine.startsWith('> ');
    if (isQuote) {
      currentLine = currentLine.substring(2).trim();
    }

    const isBullet = /^[-*•]\s+/.test(currentLine);
    const isOrdered = /^\d+\.\s+/.test(currentLine);

    if (isBullet) {
      currentLine = currentLine.replace(/^[-*•]\s+/, '');
    } else if (isOrdered) {
      currentLine = currentLine.replace(/^\d+\.\s+/, '');
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
          className="border-l-4 border-[#EAB308] pl-4 py-2.5 my-2 bg-[#FDF5DA] rounded-r-lg text-[#15333B] italic shadow-sm text-base"
        >
          {parsedLine}
        </blockquote>
      );
    }

    if (isBullet) {
      return (
        <div key={idx} className="flex items-start gap-2 my-1 pl-1 text-base leading-relaxed text-[#3E5E63]">
          <span className="text-[#214C54] font-black text-sm select-none shrink-0 mt-0.5">•</span>
          <span className="flex-1 min-w-0">{parsedLine}</span>
        </div>
      );
    }

    if (isOrdered) {
      const numberMatch = line.match(/^(\d+)\.\s+/);
      const num = numberMatch ? numberMatch[1] : `${idx + 1}`;
      return (
        <div key={idx} className="flex items-start gap-2 my-1 pl-1 text-base leading-relaxed text-[#3E5E63]">
          <span className="text-[#214C54] font-bold text-xs select-none shrink-0 mt-1 min-w-[1.2rem]">{num}.</span>
          <span className="flex-1 min-w-0">{parsedLine}</span>
        </div>
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
