import React from 'react';
import { 
  BookOpen, Wrench, Bot, Compass, Palette, FlaskConical, Anchor, 
  ClipboardList 
} from 'lucide-react';
import type { OnboardingDay } from '../types/database';

export const DAY_VISUAL_STYLES: {
  [key: number]: {
    icon: React.ReactNode;
    gradient: string;
    summary: string;
    bgPattern: React.ReactNode;
  };
} = {
  1: {
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-[#EAB308] to-[#CA8A04]", // Golden Sea Parchment
    summary: "Kết nối cộng đồng & cam kết hành động",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M-10 80 Q20 50 50 80 T110 80 T170 80 T230 80 T295 80" fill="none" stroke="white" strokeWidth="2" />
        <path d="M-10 100 Q20 70 50 100 T110 100 T170 100 T230 100 T295 100" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="240" cy="30" r="15" fill="none" stroke="white" strokeWidth="2" />
        <line x1="240" y1="10" x2="240" y2="50" stroke="white" strokeWidth="2" />
        <line x1="220" y1="30" x2="260" y2="30" stroke="white" strokeWidth="2" />
      </svg>
    )
  },
  2: {
    icon: <Wrench className="w-6 h-6" />,
    gradient: "from-[#0284C7] to-[#0369A1]", // Blueprint Blue
    summary: "Xác định sản phẩm bạn muốn xây dựng",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="230" cy="40" r="25" fill="none" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  },
  3: {
    icon: <Bot className="w-6 h-6" />,
    gradient: "from-[#059669] to-[#047857]", // Mystic Emerald Dragon
    summary: "Làm quen với IDE, MCP và CLI",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20 C60 5 90 40 130 20 C170 0 200 35 240 15" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        <path d="M10 50 Q70 20 120 70 T240 40" fill="none" stroke="white" strokeWidth="1.5" />
        <polygon points="210,15 220,5 230,15 220,25" fill="white" />
      </svg>
    )
  },
  4: {
    icon: <Compass className="w-6 h-6" />,
    gradient: "from-[#845EF7] to-[#6741D9]", // Telescope Deep Purple
    summary: "Hiểu về Agent Skills và Agent Rules",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="50" r="35" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="150" cy="50" r="5" fill="white" />
        <line x1="150" y1="10" x2="150" y2="90" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="50" x2="190" y2="50" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="150,20 155,45 150,50" fill="white" />
        <polygon points="150,80 145,55 150,50" fill="#FFD94C" />
      </svg>
    )
  },
  5: {
    icon: <Palette className="w-6 h-6" />,
    gradient: "from-[#D946EF] to-[#C026D3]", // Oil Paint Palette Pink/Fuchsia
    summary: "Lưu trữ và quản lý phiên bản với GitHub",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="30" r="20" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="120" cy="60" r="30" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="210" cy="40" r="15" fill="none" stroke="white" strokeWidth="1.5" />
        <path d="M10 80 Q 140 20 280 80" fill="none" stroke="white" strokeWidth="1" />
      </svg>
    )
  },
  6: {
    icon: <FlaskConical className="w-6 h-6" />,
    gradient: "from-[#F97316] to-[#EA580C]", // Bright Amber Sunset
    summary: "Tìm hiểu cấu trúc Frontend và Backend",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="20" width="40" height="50" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <line x1="40" y1="35" x2="60" y2="35" stroke="white" strokeWidth="2" />
        <line x1="40" y1="45" x2="60" y2="45" stroke="white" strokeWidth="2" />
        <line x1="40" y1="55" x2="55" y2="55" stroke="white" strokeWidth="2" />
        <circle cx="220" cy="40" r="20" fill="none" stroke="white" strokeWidth="1.5" />
        <line x1="220" y1="20" x2="220" y2="60" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  },
  7: {
    icon: <Anchor className="w-6 h-6" />,
    gradient: "from-[#0D9488] to-[#0F766E]", // Sea Teal Ocean
    summary: "Đưa sản phẩm lên Internet với Domain & DNS",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M150 15 L150 65 M135 30 L165 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="150" cy="15" r="5" fill="none" stroke="white" strokeWidth="3" />
        <path d="M125 50 C125 70 175 70 175 50" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 50 L115 45 M180 50 L185 45" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  8: {
    icon: <ClipboardList className="w-6 h-6" />,
    gradient: "from-[#EC4899] to-[#DB2777]", // Rose Pink
    summary: "Biết cách tư duy theo User Journey & vẽ User Flow",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="30" height="20" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <line x1="50" y1="30" x2="100" y2="30" stroke="white" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="100" y="20" width="30" height="20" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <line x1="130" y1="30" x2="180" y2="30" stroke="white" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="180" y="20" width="30" height="20" rx="3" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    )
  }
};

export const getDefaultEmailSubject = (dayNum: number, title: string) => {
  return `[The1ight] [Onboarding Week] Thử thách Ngày ${dayNum}: ${title}`;
};

export const getDefaultEmailBody = (dayData: OnboardingDay) => {
  return `Kẹt kẹt... Alo alo! 🦜

Chào mừng bạn tới ngày học tiếp theo của Onboarding Week!

Hôm nay chúng ta sẽ bắt đầu Thử thách Ngày ${dayData.day}: ${dayData.title}

🎯 MỤC TIÊU:
${dayData.objective}

📝 NHIỆM VỤ:
${dayData.checklist}

✨ ĐIỀU RÚT RA (TAKEAWAY):
${dayData.takeaway}

Hãy truy cập vào hệ thống LightMS để theo dõi chi tiết và cập nhật bài tập nhé!

Chúc các thủy thủ thuận buồm xuôi gió! ⛵⚓`;
};

export const getHtmlEmail = (subject: string, bodyText: string) => {
  const formattedBody = bodyText
    .split('\n\n')
    .map(p => `<p style="margin: 0 0 12px; line-height: 1.6; color: #3E5E63;">${p.replace(/\n/g, '<br />')}</p>`)
    .join('');

  return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF5DA; padding: 25px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1.5px solid #ffd94c;">
  <div style="background-color: #15333B; padding: 15px; border-radius: 12px 12px 0 0; text-align: center; border-bottom: 4px solid #ffd94c;">
    <h1 style="color: #ffd94c; margin: 0; font-size: 18px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
    </h1>
  </div>
  <div style="background-color: #ffffff; padding: 25px; border-radius: 0 0 12px 12px; border-top: none; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
    <h2 style="color: #214C54; margin-top: 0; font-size: 15px; font-weight: 800; border-bottom: 2px solid #F0F0F0; padding-bottom: 8px;">
      ${subject}
    </h2>
    ${formattedBody}
    <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #F0F0F0; text-align: center;">
      <a href="${window.location.origin}" style="display: inline-block; background-color: #214C54; color: #ffffff; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 11px; box-shadow: 0 2px 4px rgba(33,76,84,0.2);">
        VÀO HỆ THỐNG LIGHTMS 🚀
      </a>
    </div>
  </div>
  <div style="text-align: center; margin-top: 12px; font-size: 9px; color: #3E5E63; font-weight: 600;">
    Bản tin được gửi từ hạm đội vận hành LightMS. Chúc các thủy thủ thuận buồm xuôi gió!
  </div>
</div>
  `.trim();
};

export const parseInlineMarkdown = (text: string): React.ReactNode => {
  let cleanText = text
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<font[^>]*>/gi, '')
    .replace(/<\/font>/gi, '')
    .replace(/<br[^>]*>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '');

  const regex = /\[(.*?)\]\((.*?)\)|<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>|\*\*(.*?)\*\*|\*(.*?)\*|<u>(.*?)<\/u>|<em[^>]*>(.*?)<\/em>/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleanText.substring(lastIndex, match.index));
    }
    if (match[1] && match[2]) {
      parts.push(
        <a key={`link-${match.index}`} href={match[2]} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-700 hover:underline font-bold transition-colors">
          {match[1]} <span className="text-[10px] inline-block ml-0.5">🔗</span>
        </a>
      );
    } else if (match[3] && match[4]) {
      parts.push(
        <a key={`link-html-${match.index}`} href={match[3]} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-700 hover:underline font-bold transition-colors">
          {match[4]} <span className="text-[10px] inline-block ml-0.5">🔗</span>
        </a>
      );
    } else if (match[5]) {
      const isTaskHeading = match[5].toLowerCase().startsWith('task ');
      parts.push(
        <strong 
          key={`bold-${match.index}`} 
          className={isTaskHeading ? "block text-base font-semibold text-[#214C54] mb-1" : "font-semibold text-[#214C54]"}
        >
          {match[5]}
        </strong>
      );
    } else if (match[6]) {
      parts.push(
        <em key={`italic-md-${match.index}`} className="italic">
          {match[6]}
        </em>
      );
    } else if (match[7]) {
      parts.push(
        <u key={`underline-${match.index}`} className="underline">
          {match[7]}
        </u>
      );
    } else if (match[8]) {
      parts.push(
        <em key={`italic-html-${match.index}`} className="italic">
          {match[8]}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? <>{parts}</> : text;
};

export const renderRichText = (text: string): React.ReactNode => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const isQuote = line.startsWith('> ');
    if (isQuote) {
      line = line.substring(2);
    }
    
    const parsedLine = parseInlineMarkdown(line);

    if (isQuote) {
      return (
        <blockquote key={idx} className="border-l-4 border-[#EAB308] pl-4 py-3 my-3 bg-[#FDF5DA] rounded-r-lg text-[#15333B] italic shadow-sm text-base">
          {parsedLine}
        </blockquote>
      );
    }

    return (
      <div key={idx} className="min-h-[1.2em] my-1 text-base leading-relaxed text-[#3E5E63]">
        {parsedLine}
      </div>
    );
  });
};
