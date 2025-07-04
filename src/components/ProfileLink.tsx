"use client";

import Link from 'next/link';
import UserAvatar from './UserAvatar';

interface ProfileLinkProps {
  id: string;
  name: string;
  type?: 'Provider' | 'Client';
  imageSrc?: string;
  showAvatar?: boolean;
  showBadge?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProfileLink({
  id,
  name,
  type = 'Client',
  imageSrc,
  showAvatar = true,
  showBadge = false,
  className = '',
  size = 'sm'
}: ProfileLinkProps) {
  const isProvider = type === 'Provider';
  const profileUrl = `/profiles/${id}`;

  return (
    <Link 
      href={profileUrl}
      className={`inline-flex items-center hover:text-blue-600 group ${className}`}
    >
      {showAvatar && (
        <UserAvatar 
          id={id}
          name={name}
          imageSrc={imageSrc}
          size={size}
          isProvider={isProvider}
        />
      )}
      
      <span className="ml-2 font-medium text-gray-700 group-hover:text-blue-600">
        {name}
      </span>
      
      {showBadge && (
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
          isProvider ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {type}
        </span>
      )}
    </Link>
  );
} 