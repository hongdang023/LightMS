import React from 'react';

interface IconProps {
  className?: string;
  active?: boolean;
}

// 1. HomeIcon (Compass)
export const HomeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M12 3V5M12 19V21M3 12H5M19 12H21" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 7L14.5 12L12 17L9.5 12L12 7Z" fill={accentColor} fillOpacity="0.2" stroke={accentColor} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1" fill={primaryColor} />
    </svg>
  );
};

// 2. AboutIcon (Logbook)
export const AboutIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19V5C4 3.89543 4.89543 3 6 3H12V21H6C4.89543 21 4 20.1046 4 19Z" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M12 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H12" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M7 7H9M7 11H9M7 15H9" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 7H17M14 11H17" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 3V10L14 8L16 10V3" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

// 3. OnboardingIcon (Set Sail - Cánh buồm)
export const OnboardingIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18C3 18 6 20 12 20C18 20 21 18 21 18L19 15H5L3 18Z" stroke={primaryColor} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 4V15" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4C12 4 6 6 6 11C6 15 12 15 12 15" stroke={primaryColor} strokeWidth="1.5" strokeLinejoin="round" fill={primaryColor} fillOpacity="0.05" />
      <path d="M12 4C12 4 18 5 18 9C18 13 12 14 12 14" stroke={accentColor} strokeWidth="1.5" strokeLinejoin="round" fill={accentColor} fillOpacity="0.2" />
    </svg>
  );
};

// 4. SyllabusIcon (Scroll Map)
export const SyllabusIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4H6C4.9 4 4 4.9 4 6Z" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M4 8H20M4 16H20" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M8 12C9 10 11 10 12 12C13 14 15 14 16 12" stroke={accentColor} strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
      <circle cx="8" cy="12" r="1.5" fill={primaryColor} />
      <circle cx="16" cy="12" r="1.5" fill={accentColor} />
    </svg>
  );
};

// 5. SkillsIcon (Sextant)
export const SkillsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L6 17" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4L18 17" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 17C7.5 19.5 16.5 19.5 19 17" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4L10 20" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1.5" fill={primaryColor} />
      <circle cx="10" cy="20" r="1.5" fill={accentColor} />
    </svg>
  );
};

// 6. DiscussionsIcon (Tavern Banner)
export const DiscussionsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 11.5C21 7.91015 17.6421 5 13.5 5C9.35786 5 6 7.91015 6 11.5C6 13.1478 6.70932 14.6534 7.89293 15.8C7.5 17.5 6.5 18.5 6.5 18.5C6.5 18.5 8.5 18.5 10.4286 17.0654C11.3854 17.669 12.4172 18 13.5 18C17.6421 18 21 15.0899 21 11.5Z" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 9.5C3.5 9.5 4.5 9.5 5.5 10.5C5.8 9.5 6.2 8.6 6.8 7.8C4.5 8.4 3.5 9.5 3.5 9.5Z" fill={accentColor} stroke={accentColor} strokeWidth="1.5" />
      <circle cx="11" cy="11.5" r="1" fill={primaryColor} />
      <circle cx="13.5" cy="11.5" r="1" fill={primaryColor} />
      <circle cx="16" cy="11.5" r="1" fill={primaryColor} />
    </svg>
  );
};

// 7. ScheduleIcon (Astrolabe)
export const ScheduleIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke={primaryColor} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={primaryColor} strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M12 12L15 9" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12V4" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12H20" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

// 8. LeaderboardIcon (Nautical Star)
export const LeaderboardIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 8-pointed Nautical Star */}
      <path d="M12 2L13.8 9L20.8 7.2L15 12L20.8 16.8L13.8 15L12 22L10.2 15L3.2 16.8L9 12L3.2 7.2L10.2 9L12 2Z" stroke={primaryColor} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 2V12L15 9L12 2Z" fill={accentColor} />
      <path d="M20.8 7.2L12 12L13.8 15L20.8 7.2Z" fill={accentColor} fillOpacity="0.4" />
      <path d="M12 22V12L9 15L12 22Z" fill={accentColor} />
      <path d="M3.2 16.8L12 12L10.2 9L3.2 16.8Z" fill={accentColor} fillOpacity="0.4" />
    </svg>
  );
};

// 9. SupportIcon (Lifebuoy)
export const SupportIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={primaryColor} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M6.3 6.3L9.2 9.2" stroke={accentColor} strokeWidth="1.5" />
      <path d="M17.7 17.7L14.8 14.8" stroke={accentColor} strokeWidth="1.5" />
      <path d="M17.7 6.3L14.8 9.2" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M6.3 17.7L9.2 14.8" stroke={primaryColor} strokeWidth="1.5" />
    </svg>
  );
};

// 10. ProfileIcon (Captain)
export const ProfileIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      {/* Captain's Hat Outline */}
      <path d="M9 5C10 4 14 4 15 5C16 3.5 15 2 12 2C9 2 8 3.5 9 5Z" fill={accentColor} stroke={accentColor} strokeWidth="1" />
    </svg>
  );
};

// 11. AnnouncementsIcon (Megaphone / Bell)
export const AnnouncementsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5.5C11 4.67157 11.6716 4 12.5 4C13.3284 4 14 4.67157 14 5.5V7.12455C17.4111 8.01633 20 11.1963 20 15V18.25C20 18.6642 20.3358 19 20.75 19H3.25C3.66421 19 4 18.6642 4 18.25V15C4 11.1963 6.58889 8.01633 10 7.12455V5.5H11Z" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M10 19C10 20.6569 11.1193 22 12.5 22C13.8807 22 15 20.6569 15 19H10Z" fill={accentColor} stroke={accentColor} strokeWidth="1.5" />
      <path d="M18 6L20 4" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M21 9L23 8" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

// Admin Icons
export const AdminDashboardIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="9" rx="1" stroke={primaryColor} strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1" stroke={primaryColor} strokeWidth="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1" stroke={primaryColor} strokeWidth="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1" stroke={accentColor} strokeWidth="1.5" />
    </svg>
  );
};

export const CourseBuilderIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5V19.5" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 7.5H19" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 12H19" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 16.5H19" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const SpeedGraderIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11L11 13L15 9" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={primaryColor} strokeWidth="1.5" />
    </svg>
  );
};

export const StudentsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const InternalTeamIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', active }) => {
  const primaryColor = active ? '#FFD94C' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={primaryColor} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 7V17" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 10H15" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const AnchorIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', active }) => {
  const primaryColor = active ? '#214C54' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V20M12 20C12 20 6 18 6 13M12 20C12 20 18 18 18 13" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="5" r="2" stroke={accentColor} strokeWidth="2" />
      <path d="M8 12H16" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const RouteIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', active }) => {
  const primaryColor = active ? '#214C54' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 17C18 18.6569 16.6569 20 15 20C13.3431 20 12 18.6569 12 17C12 15.3431 10.6569 14 9 14C7.34315 14 6 15.3431 6 17" stroke={primaryColor} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 7C6 5.34315 7.34315 4 9 4C10.6569 4 12 5.34315 12 7C12 8.65685 13.3431 10 15 10C16.6569 10 18 8.65685 18 7" stroke={primaryColor} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="6" cy="17" r="1.5" fill={primaryColor} />
      <circle cx="18" cy="7" r="1.5" fill={accentColor} />
    </svg>
  );
};

export const GiftIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', active }) => {
  const primaryColor = active ? '#214C54' : '#3E5E63';
  const accentColor = '#EAB308';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="9" width="16" height="11" rx="1" stroke={primaryColor} strokeWidth="1.5" />
      <rect x="3" y="6" width="18" height="3" rx="0.5" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M12 6V20" stroke={primaryColor} strokeWidth="1.5" />
      <path d="M12 6C12 6 9 3 9 4.5C9 6 12 6 12 6ZM12 6C12 6 15 3 15 4.5C15 6 12 6 12 6Z" fill={accentColor} stroke={accentColor} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

