"use client";

import Image from 'next/image';
import Link from 'next/link';

interface UserAvatarProps {
  id: string;
  name: string;
  imageSrc?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  isProvider?: boolean;
}

export default function UserAvatar({
  id,
  name,
  imageSrc,
  size = 'md',
  showName = false,
  isProvider = false
}: UserAvatarProps) {
  // Determine size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  // Determine font size for initials
  const fontSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  // Get initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Profile URL
  const profileUrl = `/profiles/${id}`;

  return (
    <Link href={profileUrl} className="group flex items-center">
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 flex-shrink-0 group-hover:ring-2 ring-blue-500`}>
        {imageSrc ? (
          <Image 
            src={imageSrc} 
            alt={name} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${fontSizeClasses[size]} font-medium text-gray-700 bg-gray-200`}>
            {initials}
          </div>
        )}
        {isProvider && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-purple-500 rounded-full border-2 border-white" />
        )}
      </div>
      
      {showName && (
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 truncate">
          {name}
        </span>
      )}
    </Link>
  );
} 