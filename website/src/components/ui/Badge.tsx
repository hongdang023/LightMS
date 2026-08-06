import React from 'react';

type BadgeVariant =
  | 'mastery'
  | 'submitted'
  | 'graded'
  | 'pending'
  | 'overdue'
  | 'info'
  | 'warning'
  | 'success'
  | 'error';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

// Badge variant styles — aligned to B4 §8.1
// Uses LightMS-specific semantic naming instead of generic colors
const variantMap: Record<BadgeVariant, string> = {
  // Gamification: gold palette — for Mastery achievements
  mastery: 'bg-[#FDF5DA] text-[#EAB308] border-[#EAB308]',

  // Brand teal — for submitted / awaiting review state
  submitted: 'bg-[#EFF6FF] text-[#214C54] border-[#214C54]',

  // Success green — for graded / completed state
  graded: 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]',

  // Neutral gray — for pending / locked state
  pending: 'bg-[#F0F0F0] text-[#6B7280] border-[#D1D5DB]',

  // Danger red — for overdue state
  overdue: 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]',

  // Generic info blue — for general informational labels
  info: 'bg-[#EFF6FF] text-[#3B82F6] border-[#3B82F6]',

  // Warning amber — for deadline warnings
  warning: 'bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]',

  // Generic success (alias of graded for non-submission contexts)
  success: 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]',

  // Generic error (alias of overdue for non-deadline contexts)
  error: 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]',
};

const sizeMap: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full border ${variantMap[variant]} ${sizeMap[size]} ${className}`}
    >
      {children}
    </span>
  );
};
