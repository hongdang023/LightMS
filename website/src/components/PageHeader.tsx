import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  // Help popover content
  helpTitle?: string;       // Section name in popover (uppercase dot)
  helpSummary?: string;     // Short description inside popover
  helpPurpose?: string;     // Answer to "Trang này giúp gì cho tôi?"
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  helpTitle,
  helpSummary,
  helpPurpose,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasHelp = helpSummary || helpPurpose;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="mb-5 w-full animate-fade-in select-none">
      <div className="flex items-start justify-between gap-4">

        {/* Title row */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-[#15333B] tracking-tight leading-tight m-0">
              {title}
            </h1>

            {/* Help icon with popover */}
            {hasHelp && (
              <div className="relative" ref={ref}>
                <button
                  onClick={() => setPopoverOpen(prev => !prev)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    popoverOpen
                      ? 'border-[#EAB308] text-[#EAB308]'
                      : 'border-gray-300 text-gray-400 hover:border-[#EAB308] hover:text-[#EAB308]'
                  }`}
                  title="Trang này là gì?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>

                {popoverOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 animate-fade-in overflow-hidden">
                    {/* Section name with dot */}
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] shrink-0" />
                        <span className="text-xs font-black text-[#15333B] uppercase tracking-widest">
                          {helpTitle || title}
                        </span>
                      </div>
                      {helpSummary && (
                        <p className="text-sm text-gray-500 leading-relaxed m-0">
                          {helpSummary}
                        </p>
                      )}
                    </div>

                    {helpPurpose && (
                      <>
                        <div className="border-t border-gray-100 mx-5" />
                        <div className="px-5 pt-4 pb-5">
                          <p className="text-[10px] font-black text-[#EAB308] uppercase tracking-widest mb-2">
                            Trang này giúp gì cho tôi?
                          </p>
                          <p className="text-sm font-bold text-[#15333B] leading-relaxed m-0">
                            {helpPurpose}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Close button */}
                    <button
                      onClick={() => setPopoverOpen(false)}
                      className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {description && (
            <p className="text-sm text-gray-500 leading-snug m-0 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0 mt-1">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
