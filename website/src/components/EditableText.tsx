import React, { useState, useEffect, useRef } from 'react';

/**
 * EditableText — renders text as-is normally; when isEditing=true, wraps it
 * in a seamless textarea that blends into the parent styling.
 * Saves on blur automatically.
 */
interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  /** Additional className applied to the wrapper/textarea */
  className?: string;
  /** Minimum rows for the textarea */
  minRows?: number;
  /** Use monospace font */
  mono?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  className = '',
  minRows = 2,
  mono = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = taRef.current.scrollHeight + 'px';
    }
  }, [localValue, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  return (
    <textarea
      ref={taRef}
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      rows={minRows}
      className={`w-full bg-transparent resize-none transition-all duration-200 outline-none ${
        isFocused
          ? 'ring-2 ring-[#214C54] bg-white rounded-xl px-3 py-2 shadow-inner'
          : 'ring-1 ring-dashed ring-[#214C54]/30 hover:ring-[#214C54]/60 hover:bg-white/50 rounded-xl px-3 py-2 cursor-text'
      } ${mono ? 'font-mono text-xs' : ''} ${className}`}
      style={{ overflow: 'hidden' }}
    />
  );
};
