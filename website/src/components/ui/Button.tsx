import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gamification';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base: shared across all variants
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 disabled:shadow-none group';

  // Variant styles — aligned to B4 §2.1
  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    // Primary: #214C54 bg, white text. Hover: darker + lift + shadow-md
    primary:
      'bg-[#214C54] text-white hover:bg-[#15333B] hover:shadow-md hover:-translate-y-0.5',

    // Secondary: transparent bg, #3E5E63 border + text. Hover: canvas-gray bg
    secondary:
      'bg-transparent border border-[#3E5E63] text-[#3E5E63] hover:bg-[#F0F0F0] shadow-none hover:shadow-sm',

    // Gamification: #EAB308 (deep gold) bg, dark text. Only for Gamification CTA
    gamification:
      'bg-[#EAB308] text-[#15333B] hover:bg-[#D4A00A] hover:shadow-md hover:-translate-y-0.5',

    // Danger: red bg, white text. Always pair with confirmation dialog
    danger:
      'bg-[#EF4444] text-white hover:bg-[#DC2626] hover:shadow-md hover:-translate-y-0.5',

    // Ghost: fully transparent, subtle hover bg. For low-priority actions
    ghost:
      'bg-transparent text-[#3E5E63] shadow-none hover:bg-[#F0F0F0]',
  };

  // Size styles — padding scale per B4 §2.3
  const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-[11px] gap-1',
    md: 'px-4 py-2 text-xs gap-1.5',
    lg: 'px-6 py-3 text-sm gap-2',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant!]} ${sizeStyles[size!]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
