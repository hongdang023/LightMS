import React from 'react';
import * as Icons from 'lucide-react';

interface BadgeIconProps {
  name: string;
  className?: string;
  size?: number;
  isUnlocked?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ 
  name, 
  className = '', 
  size = 20,
  isUnlocked = true 
}) => {
  // Map string to Lucide component
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback if icon not found
    return <Icons.Award className={className} size={size} />;
  }

  // Brilliant-style duotone colors
  return (
    <IconComponent 
      className={className} 
      size={size}
      stroke={isUnlocked ? '#214C54' : '#9CA3AF'}
      fill={isUnlocked ? '#EAB308' : 'transparent'}
      strokeWidth={2}
    />
  );
};
